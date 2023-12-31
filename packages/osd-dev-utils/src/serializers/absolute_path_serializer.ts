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

// Not importing from @osd/cross-platform to allow some complicated tests to run: suite_tracker.test.ts
import { REPO_ROOT, REPO_ROOT_8_3 } from '@osd/utils';

export function createAbsolutePathSerializer(
  rootPath: string | string[] = [REPO_ROOT, REPO_ROOT_8_3],
  replacement = '<absolute path>'
) {
  const rootPaths = Array.isArray(rootPath) ? rootPath : [rootPath];

  if (process.platform === 'win32') {
    rootPaths.push(...rootPaths.map((name) => name.replace(/\\/g, '/')));
  }

  return {
    test: (value: any) =>
      typeof value === 'string' && rootPaths.some((path) => value.startsWith(path)),
    serialize: (value: string) =>
      rootPaths
        // Replace all instances of `rootPaths` found at the beginning of the `value`
        .reduce(
          (result, path) => (result.startsWith(path) ? result.replace(path, replacement) : result),
          value
        )
        .replace(/\\/g, '/'),
  };
}
