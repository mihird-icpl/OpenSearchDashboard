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

import Path from 'path';
import Os from 'os';

import {
  Bundle,
  WorkerConfig,
  CacheableWorkerConfig,
  ThemeTag,
  ThemeTags,
  parseThemeTags,
} from '../common';

import {
  findOpenSearchDashboardsPlatformPlugins,
  OpenSearchDashboardsPlatformPlugin,
} from './opensearch_dashboards_platform_plugins';
import { getPluginBundles } from './get_plugin_bundles';
import { filterById } from './filter_by_id';
import { readLimits } from '../limits';

export interface Limits {
  pageLoadAssetSize?: {
    [id: string]: number | undefined;
  };
}

function pickMaxWorkerCount(dist: boolean) {
  // don't break if cpus() returns nothing, or an empty array
  const cpuCount = Math.max(Os.cpus()?.length, 1);
  // if we're buiding the dist then we can use more of the system's resources to get things done a little quicker
  const maxWorkers = dist ? cpuCount - 1 : Math.ceil(cpuCount / 3);
  // ensure we always have at least two workers
  return Math.max(maxWorkers, 2);
}

function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result: any = {};
  for (const [key, value] of Object.entries(obj) as any) {
    if (!keys.includes(key)) {
      result[key] = value;
    }
  }
  return result as Omit<T, K>;
}

interface Options {
  /** absolute path to root of the repo/build */
  repoRoot: string;
  /**
   * absolute path to the root directory where output should be written to. This
   * defaults to the repoRoot but can be customized to write output somewhere else.
   *
   * This is how we write output to the build directory in the OpenSearch Dashboards build tasks.
   */
  outputRoot?: string;
  /** enable to run the optimizer in watch mode */
  watch?: boolean;
  /** the maximum number of workers that will be created */
  maxWorkerCount?: number;
  /** set to false to disabling writing/reading of caches */
  cache?: boolean;
  /** build assets suitable for use in the distributable */
  dist?: boolean;
  /** enable webpack profiling, writes stats.json files to the root of each plugin's output dir */
  profileWebpack?: boolean;
  /** set to true to inspecting workers when the parent process is being inspected */
  inspectWorkers?: boolean;

  /** include examples in default scan dirs */
  examples?: boolean;
  /** absolute paths to specific plugins that should be built */
  pluginPaths?: string[];
  /** absolute paths to directories that should be built, overrides the default scan dirs */
  pluginScanDirs?: string[];
  /** absolute paths that should be added to the default scan dirs */
  extraPluginScanDirs?: string[];
  /**
   * array of comma separated patterns that will be matched against bundle ids.
   * bundles will only be built if they match one of the specified patterns.
   * `*` can exist anywhere in each pattern and will match anything, `!` inverts the pattern
   *
   * examples:
   *  --filter foo --filter bar # [foo, bar], excludes [foobar]
   *  --filter foo,bar # [foo, bar], excludes [foobar]
   *  --filter foo* # [foo, foobar], excludes [bar]
   *  --filter f*r # [foobar], excludes [foo, bar]
   */
  filter?: string[];

  /** flag that causes the core bundle to be built along with plugins */
  includeCoreBundle?: boolean;

  /**
   * style themes that sass files will be converted to, the correct style will be
   * loaded in the browser automatically by checking the global `__osdThemeTag__`.
   * Specifying additional styles increases build time.
   *
   * Defaults:
   *  - "*" when building the dist
   *  - comma separated list of themes in the `OSD_OPTIMIZER_THEMES` env var
   *  - "k7light"
   */
  themes?: ThemeTag | '*' | ThemeTag[];
}

export interface ParsedOptions {
  repoRoot: string;
  outputRoot: string;
  watch: boolean;
  maxWorkerCount: number;
  profileWebpack: boolean;
  cache: boolean;
  dist: boolean;
  pluginPaths: string[];
  pluginScanDirs: string[];
  filters: string[];
  inspectWorkers: boolean;
  includeCoreBundle: boolean;
  themeTags: ThemeTags;
}

export class OptimizerConfig {
  static parseOptions(options: Options): ParsedOptions {
    const watch = !!options.watch;
    const dist = !!options.dist;
    const examples = !!options.examples;
    const profileWebpack = !!options.profileWebpack;
    const inspectWorkers = !!options.inspectWorkers;
    const cache = options.cache !== false && !process.env.OSD_OPTIMIZER_NO_CACHE;
    const includeCoreBundle = !!options.includeCoreBundle;
    const filters = options.filter || [];

    const repoRoot = options.repoRoot;
    if (!Path.isAbsolute(repoRoot)) {
      throw new TypeError('repoRoot must be an absolute path');
    }

    const outputRoot = options.outputRoot ?? repoRoot;
    if (!Path.isAbsolute(outputRoot)) {
      throw new TypeError('outputRoot must be an absolute path');
    }

    /**
     * BEWARE: this needs to stay roughly synchronized with
     * `src/core/server/config/env.ts` which determines which paths
     * should be searched for plugins to load
     */
    const pluginScanDirs = options.pluginScanDirs || [
      Path.resolve(repoRoot, 'src/plugins'),
      Path.resolve(repoRoot, 'plugins'),
      ...(examples ? [Path.resolve('examples')] : []),
      Path.resolve(repoRoot, 'opensearch-dashboards-extra'),
    ];

    if (!pluginScanDirs.every((p) => Path.isAbsolute(p))) {
      throw new TypeError('pluginScanDirs must all be absolute paths');
    }

    for (const extraPluginScanDir of options.extraPluginScanDirs || []) {
      if (!Path.isAbsolute(extraPluginScanDir)) {
        throw new TypeError('extraPluginScanDirs must all be absolute paths');
      }
      pluginScanDirs.push(extraPluginScanDir);
    }

    const pluginPaths = options.pluginPaths || [];
    if (!pluginPaths.every((s) => Path.isAbsolute(s))) {
      throw new TypeError('pluginPaths must all be absolute paths');
    }

    const maxWorkerCount = process.env.OSD_OPTIMIZER_MAX_WORKERS
      ? parseInt(process.env.OSD_OPTIMIZER_MAX_WORKERS, 10)
      : options.maxWorkerCount ?? pickMaxWorkerCount(dist);
    if (typeof maxWorkerCount !== 'number' || !Number.isFinite(maxWorkerCount)) {
      throw new TypeError('worker count must be a number');
    }

    const themeTags = parseThemeTags(
      options.themes || (dist ? '*' : process.env.OSD_OPTIMIZER_THEMES)
    );

    return {
      watch,
      dist,
      repoRoot,
      outputRoot,
      maxWorkerCount,
      profileWebpack,
      cache,
      pluginScanDirs,
      pluginPaths,
      filters,
      inspectWorkers,
      includeCoreBundle,
      themeTags,
    };
  }

  static create(inputOptions: Options) {
    const options = OptimizerConfig.parseOptions(inputOptions);
    const plugins = findOpenSearchDashboardsPlatformPlugins(
      options.pluginScanDirs,
      options.pluginPaths
    );
    const bundles = [
      ...(options.includeCoreBundle
        ? [
            new Bundle({
              type: 'entry',
              id: 'core',
              publicDirNames: ['public', 'public/utils'],
              sourceRoot: options.repoRoot,
              contextDir: Path.resolve(options.repoRoot, 'src/core'),
              outputDir: Path.resolve(options.outputRoot, 'src/core/target/public'),
            }),
          ]
        : []),
      ...getPluginBundles(plugins, options.repoRoot, options.outputRoot),
    ];

    return new OptimizerConfig(
      filterById(options.filters, bundles),
      options.cache,
      options.watch,
      options.inspectWorkers,
      plugins,
      options.repoRoot,
      options.maxWorkerCount,
      options.dist,
      options.profileWebpack,
      options.themeTags,
      readLimits()
    );
  }

  constructor(
    public readonly bundles: Bundle[],
    public readonly cache: boolean,
    public readonly watch: boolean,
    public readonly inspectWorkers: boolean,
    public readonly plugins: OpenSearchDashboardsPlatformPlugin[],
    public readonly repoRoot: string,
    public readonly maxWorkerCount: number,
    public readonly dist: boolean,
    public readonly profileWebpack: boolean,
    public readonly themeTags: ThemeTags,
    public readonly limits: Limits
  ) {}

  getWorkerConfig(optimizerCacheKey: unknown): WorkerConfig {
    return {
      cache: this.cache,
      dist: this.dist,
      profileWebpack: this.profileWebpack,
      repoRoot: this.repoRoot,
      watch: this.watch,
      optimizerCacheKey,
      themeTags: this.themeTags,
      browserslistEnv: this.dist ? 'production' : process.env.BROWSERSLIST_ENV || 'dev',
    };
  }

  getCacheableWorkerConfig(): CacheableWorkerConfig {
    return omit(this.getWorkerConfig('♻'), [
      // these config options don't change the output of the bundles, so
      // should not invalidate caches when they change
      'watch',
      'profileWebpack',
      'cache',
    ]);
  }
}
