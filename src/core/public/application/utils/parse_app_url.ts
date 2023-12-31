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

import { getUrlOrigin } from '@osd/std';
import { IBasePath } from '../../http';
import { App, ParsedAppUrl } from '../types';

/**
 * Parse given URL and return the associated app id and path if any app matches, or undefined if none do.
 * Input can either be:
 *
 * - an absolute path containing the basePath,
 *   e.g `/base-path/app/my-app/some-path`
 *
 * - an absolute URL matching the `origin` of the OpenSearch Dashboards instance (as seen by the browser),
 *   e.g `https://opensearch-dashboards:8080/base-path/app/my-app/some-path`
 *
 * - a path relative to the provided `currentUrl`.
 *   e.g with `currentUrl` being `https://opensearch-dashboards:8080/base-path/app/current-app/some-path`
 *   `../other-app/other-path` will be converted to `/base-path/app/other-app/other-path`
 */
export const parseAppUrl = (
  url: string,
  basePath: IBasePath,
  apps: Map<string, App<unknown>>,
  currentUrl: string = window.location.href
): ParsedAppUrl | undefined => {
  const currentOrigin = getUrlOrigin(currentUrl);
  if (!currentOrigin) {
    throw new Error('when manually provided, currentUrl must be valid url with an origin');
  }

  // remove the origin from the given url
  if (url.startsWith(currentOrigin)) {
    url = url.substring(currentOrigin.length);
  }

  // if the path is relative (i.e `../../to/somewhere`), we convert it to absolute
  if (!url.startsWith('/')) {
    url = new URL(url, currentUrl).toString().substring(currentOrigin.length);
  }

  // if using a basePath and the absolute path does not starts with it, it can't be a match
  const basePathValue = basePath.get();
  if (basePathValue && !url.startsWith(basePathValue)) {
    return undefined;
  }

  url = basePath.remove(url);
  if (!url.startsWith('/')) {
    return undefined;
  }

  for (const app of apps.values()) {
    const appPath = app.appRoute || `/app/${app.id}`;

    if (url.startsWith(appPath)) {
      const path = url.substr(appPath.length);
      return {
        app: app.id,
        path: path.length ? path : undefined,
      };
    }
  }
};
