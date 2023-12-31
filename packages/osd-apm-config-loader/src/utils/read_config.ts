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

import { readFileSync } from 'fs';
import { load } from 'js-yaml';

import { set } from '@elastic/safer-lodash-set';
import { isPlainObject } from 'lodash';
import { ensureDeepObject } from './ensure_deep_object';

const readYaml = (path: string) => load(readFileSync(path, 'utf8'));

function replaceEnvVarRefs(val: string) {
  return val.replace(/\$\{(\w+)\}/g, (match, envVarName) => {
    const envVarValue = process.env[envVarName];
    if (envVarValue !== undefined) {
      return envVarValue;
    }

    throw new Error(`Unknown environment variable referenced in config : ${envVarName}`);
  });
}

function merge(target: Record<string, any>, value: any, key?: string) {
  if ((isPlainObject(value) || Array.isArray(value)) && Object.keys(value).length > 0) {
    for (const [subKey, subVal] of Object.entries(value)) {
      merge(target, subVal, key ? `${key}.${subKey}` : subKey);
    }
  } else if (key !== undefined) {
    set(target, key, typeof value === 'string' ? replaceEnvVarRefs(value) : value);
  }

  return target;
}

/** @internal */
export const getConfigFromFiles = (configFiles: readonly string[]): Record<string, any> => {
  let mergedYaml: Record<string, any> = {};

  for (const configFile of configFiles) {
    const yaml = readYaml(configFile);
    if (yaml !== null) {
      mergedYaml = merge(mergedYaml, yaml);
    }
  }

  return ensureDeepObject(mergedYaml);
};
