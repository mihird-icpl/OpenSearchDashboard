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

import { UnsupportedProtocolError } from '../lib/errors';
import { downloadHttpFile } from './downloaders/http';
import { downloadLocalFile } from './downloaders/file';

function _isWindows() {
  return /^win/.test(process.platform);
}

export function _getFilePath(filePath) {
  const decodedPath = decodeURI(filePath);
  const prefixedDrive = /^\/[a-zA-Z]:/.test(decodedPath);
  if (_isWindows() && prefixedDrive) {
    return decodedPath.slice(1);
  }

  return decodedPath;
}

export function _checkFilePathDeprecation(sourceUrl, logger) {
  const twoSlashes = /^file:\/\/(?!\/)/.test(sourceUrl);
  if (_isWindows() && twoSlashes) {
    logger.log('Install paths with file:// are deprecated, use file:/// instead');
  }
}

export function _downloadSingle(settings, logger, sourceUrl) {
  let urlInfo;
  try {
    urlInfo = new URL('', sourceUrl);
  } catch (e) {
    return Promise.reject(new UnsupportedProtocolError());
  }
  let downloadPromise;

  if (/^file/.test(urlInfo.protocol)) {
    _checkFilePathDeprecation(sourceUrl, logger);
    downloadPromise = downloadLocalFile(
      logger,
      _getFilePath(urlInfo.pathname, sourceUrl),
      settings.tempArchiveFile
    );
  } else if (/^https?/.test(urlInfo.protocol)) {
    downloadPromise = downloadHttpFile(
      logger,
      sourceUrl,
      settings.tempArchiveFile,
      settings.timeout
    );
  } else {
    downloadPromise = Promise.reject(new UnsupportedProtocolError());
  }

  return downloadPromise;
}

//Attempts to download each url in turn until one is successful
export function download(settings, logger) {
  const urls = settings.urls.slice(0);

  function tryNext() {
    const sourceUrl = urls.shift();
    if (!sourceUrl) {
      throw new Error('No valid url specified.');
    }

    logger.log(`Attempting to transfer from ${sourceUrl}`);

    return _downloadSingle(settings, logger, sourceUrl).catch((err) => {
      const isUnsupportedProtocol = err instanceof UnsupportedProtocolError;
      const isDownloadResourceNotFound = err.message === 'ENOTFOUND';
      if (isUnsupportedProtocol || isDownloadResourceNotFound) {
        return tryNext();
      }
      throw err;
    });
  }

  return tryNext();
}
