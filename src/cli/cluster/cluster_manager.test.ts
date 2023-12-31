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

import * as Rx from 'rxjs';

import { mockCluster } from './cluster_manager.test.mocks';
import '@osd/optimizer/target/__mocks__/lmdb';

jest.mock('readline', () => ({
  createInterface: jest.fn(() => ({
    on: jest.fn(),
    prompt: jest.fn(),
    setPrompt: jest.fn(),
  })),
}));

const mockConfig: any = {};

import { sample } from 'lodash';

import { ClusterManager, SomeCliArgs } from './cluster_manager';
import { Worker } from './worker';

const CLI_ARGS: SomeCliArgs = {
  disableOptimizer: true,
  quiet: false,
  repl: false,
  runExamples: false,
  silent: false,
  watch: false,
  cache: false,
  dist: false,
};

describe('CLI cluster manager', () => {
  beforeEach(() => {
    mockCluster.fork.mockImplementation(() => {
      return {
        process: {
          kill: jest.fn(),
        },
        isDead: jest.fn().mockReturnValue(false),
        off: jest.fn(),
        on: jest.fn(),
        send: jest.fn(),
      } as any;
    });
  });

  afterEach(() => {
    mockCluster.fork.mockReset();
  });

  test('has two workers', () => {
    const manager = new ClusterManager(CLI_ARGS, mockConfig);

    expect(manager.workers).toHaveLength(1);
    for (const worker of manager.workers) {
      expect(worker).toBeInstanceOf(Worker);
    }

    expect(manager.server).toBeInstanceOf(Worker);
  });

  test('delivers broadcast messages to other workers', () => {
    const manager = new ClusterManager(CLI_ARGS, mockConfig);

    for (const worker of manager.workers) {
      Worker.prototype.start.call(worker); // bypass the debounced start method
      worker.onOnline();
    }

    const football = {};
    const messenger = sample(manager.workers) as any;

    messenger.emit('broadcast', football);
    for (const worker of manager.workers) {
      if (worker === messenger) {
        expect(worker.fork!.send).not.toHaveBeenCalled();
      } else {
        expect(worker.fork!.send).toHaveBeenCalledTimes(1);
        expect(worker.fork!.send).toHaveBeenCalledWith(football);
      }
    }
  });

  describe('interaction with BasePathProxy', () => {
    test('correctly configures `BasePathProxy`.', async () => {
      const basePathProxyMock = { start: jest.fn() };

      new ClusterManager(CLI_ARGS, mockConfig, basePathProxyMock as any);

      expect(basePathProxyMock.start).toHaveBeenCalledWith({
        shouldRedirectFromOldBasePath: expect.any(Function),
        delayUntil: expect.any(Function),
      });
    });

    describe('basePathProxy config', () => {
      let clusterManager: ClusterManager;
      let shouldRedirectFromOldBasePath: (path: string) => boolean;
      let delayUntil: () => Rx.Observable<undefined>;

      beforeEach(async () => {
        const basePathProxyMock = { start: jest.fn() };
        clusterManager = new ClusterManager(CLI_ARGS, mockConfig, basePathProxyMock as any);
        [[{ delayUntil, shouldRedirectFromOldBasePath }]] = basePathProxyMock.start.mock.calls;
      });

      describe('shouldRedirectFromOldBasePath()', () => {
        test('returns `false` for unknown paths.', () => {
          expect(shouldRedirectFromOldBasePath('')).toBe(false);
          expect(shouldRedirectFromOldBasePath('some-path/')).toBe(false);
          expect(shouldRedirectFromOldBasePath('some-other-path')).toBe(false);
        });

        test('returns `true` for `app` and other known paths.', () => {
          expect(shouldRedirectFromOldBasePath('app/')).toBe(true);
          expect(shouldRedirectFromOldBasePath('login')).toBe(true);
          expect(shouldRedirectFromOldBasePath('logout')).toBe(true);
          expect(shouldRedirectFromOldBasePath('status')).toBe(true);
        });
      });

      describe('delayUntil()', () => {
        test('returns an observable which emits when the server and osdOptimizer are ready and completes', async () => {
          clusterManager.serverReady$.next(false);
          clusterManager.osdOptimizerReady$.next(false);

          const events: Array<string | Error> = [];
          delayUntil().subscribe(
            () => events.push('next'),
            (error) => events.push(error),
            () => events.push('complete')
          );

          clusterManager.serverReady$.next(true);
          expect(events).toEqual([]);

          clusterManager.osdOptimizerReady$.next(true);
          expect(events).toEqual(['next', 'complete']);
        });
      });
    });
  });
});
