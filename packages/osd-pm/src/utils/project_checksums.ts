/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { stat } from 'fs/promises';
import Crypto from 'crypto';

import execa from 'execa';

import { YarnLock, resolveDepsForProject } from './yarn_lock';
import { ProjectMap } from '../utils/projects';
import { Project } from '../utils/project';
import { OpenSearchDashboards } from '../utils/opensearch_dashboards';
import { Log } from '../utils/log';

export type ChecksumMap = Map<string, string | undefined>;
/** map of [repo relative path to changed file, type of change] */
type Changes = Map<string, 'modified' | 'deleted' | 'invalid' | 'untracked'>;

const projectBySpecificitySorter = (a: Project, b: Project) => b.path.length - a.path.length;

/** Get the changed files for a set of projects */
async function getChangesForProjects(projects: ProjectMap, osd: OpenSearchDashboards, log: Log) {
  log.verbose('getting changed files');

  const { stdout } = await execa(
    'git',
    [
      'ls-files',
      '-dmto',
      '--exclude-standard',
      '--',
      ...Array.from(projects.values())
        .filter((p) => osd.isPartOfRepo(p))
        .map((p) => p.path),
    ],
    {
      cwd: osd.getAbsolute(),
    }
  );

  const output = stdout.trim();
  const unassignedChanges: Changes = new Map();

  if (output) {
    for (const line of output.split('\n')) {
      const [tag, ...pathParts] = line.trim().split(' ');
      const path = pathParts.join(' ');
      switch (tag) {
        case 'M':
        case 'C':
          // for some reason ls-files returns deleted files as both deleted
          // and modified, so make sure not to overwrite changes already
          // tracked as "deleted"
          if (unassignedChanges.get(path) !== 'deleted') {
            unassignedChanges.set(path, 'modified');
          }
          break;

        case 'R':
          unassignedChanges.set(path, 'deleted');
          break;

        case '?':
          unassignedChanges.set(path, 'untracked');
          break;

        case 'H':
        case 'S':
        case 'K':
        default:
          log.warning(`unexpected modification status "${tag}" for ${path}, please report this!`);
          unassignedChanges.set(path, 'invalid');
          break;
      }
    }
  }

  const sortedRelevantProjects = Array.from(projects.values()).sort(projectBySpecificitySorter);
  const changesByProject = new Map<Project, Changes | undefined>();

  for (const project of sortedRelevantProjects) {
    if (osd.isOutsideRepo(project)) {
      changesByProject.set(project, undefined);
      continue;
    }

    const ownChanges: Changes = new Map();
    const prefix = osd.getRelative(project.path);

    for (const [path, type] of unassignedChanges) {
      if (path.startsWith(prefix)) {
        ownChanges.set(path, type);
        unassignedChanges.delete(path);
      }
    }

    log.verbose(`[${project.name}] found ${ownChanges.size} changes`);
    changesByProject.set(project, ownChanges);
  }

  if (unassignedChanges.size) {
    throw new Error(
      `unable to assign all change paths to a project: ${JSON.stringify(
        Array.from(unassignedChanges.entries())
      )}`
    );
  }

  return changesByProject;
}

/** Get the latest commit sha for a project */
async function getLatestSha(project: Project, osd: OpenSearchDashboards) {
  if (osd.isOutsideRepo(project)) {
    return;
  }

  const { stdout } = await execa(
    'git',
    ['log', '-n', '1', '--pretty=format:%H', '--', project.path],
    {
      cwd: osd.getAbsolute(),
    }
  );

  return stdout.trim() || undefined;
}

/**
 * Get the checksum for a specific project in the workspace
 */
async function getChecksum(
  project: Project,
  changes: Changes | undefined,
  yarnLock: YarnLock,
  osd: OpenSearchDashboards,
  log: Log
) {
  const sha = await getLatestSha(project, osd);
  if (sha) {
    log.verbose(`[${project.name}] local sha:`, sha);
  }

  if (!changes || Array.from(changes.values()).includes('invalid')) {
    log.warning(`[${project.name}] unable to determine local changes, caching disabled`);
    return;
  }

  const changesSummary = await Promise.all(
    Array.from(changes)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(async ([path, type]) => {
        if (type === 'deleted') {
          return `${path}:deleted`;
        }

        const stats = await stat(osd.getAbsolute(path));
        log.verbose(`[${project.name}] modified time ${stats.mtimeMs} for ${path}`);
        return `${path}:${stats.mtimeMs}`;
      })
  );

  const depMap = resolveDepsForProject({
    project,
    yarnLock,
    osd,
    log,
    includeDependentProject: false,
    productionDepsOnly: false,
  });
  if (!depMap) {
    return;
  }

  const deps = Array.from(depMap.values())
    .map(({ name, version }) => `${name}@${version}`)
    .sort((a, b) => a.localeCompare(b));

  log.verbose(`[${project.name}] resolved %d deps`, deps.length);

  const checksum = JSON.stringify(
    {
      sha,
      changes: changesSummary,
      deps,
    },
    null,
    2
  );

  if (process.env.BOOTSTRAP_CACHE_DEBUG_CHECKSUM) {
    return checksum;
  }

  const hash = Crypto.createHash('sha1');
  hash.update(checksum);
  return hash.digest('hex');
}

/**
 * Calculate checksums for all projects in the workspace based on
 *  - last git commit to project directory
 *  - un-committed changes
 *  - resolved dependencies from yarn.lock referenced by project package.json
 */
export async function getAllChecksums(osd: OpenSearchDashboards, log: Log, yarnLock: YarnLock) {
  const projects = osd.getAllProjects();
  const changesByProject = await getChangesForProjects(projects, osd, log);

  /** map of [project.name, cacheKey] */
  const cacheKeys: ChecksumMap = new Map();

  await Promise.all(
    Array.from(projects.values()).map(async (project) => {
      cacheKeys.set(
        project.name,
        await getChecksum(project, changesByProject.get(project), yarnLock, osd, log)
      );
    })
  );

  return cacheKeys;
}
