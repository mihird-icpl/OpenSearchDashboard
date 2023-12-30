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

import {
  CollectorOptions,
  createUsageCollectionSetupMock,
} from '../../../../usage_collection/server/usage_collection.mock';

import { registerCoreUsageCollector } from '.';
import { coreUsageDataServiceMock } from '../../../../../core/server/mocks';
import { CoreUsageData } from 'src/core/server/';

describe('telemetry_core', () => {
  let collector: CollectorOptions;

  const usageCollectionMock = createUsageCollectionSetupMock();
  usageCollectionMock.makeUsageCollector.mockImplementation((config) => {
    collector = config;
    return createUsageCollectionSetupMock().makeUsageCollector(config);
  });

  const callCluster = jest.fn().mockImplementation(() => ({}));
  const coreUsageDataStart = coreUsageDataServiceMock.createStartContract();
  const getCoreUsageDataReturnValue = (Symbol('core telemetry') as any) as CoreUsageData;
  coreUsageDataStart.getCoreUsageData.mockResolvedValue(getCoreUsageDataReturnValue);

  beforeAll(() => registerCoreUsageCollector(usageCollectionMock, () => coreUsageDataStart));

  test('registered collector is set', () => {
    expect(collector).not.toBeUndefined();
    expect(collector.type).toBe('core');
  });

  test('fetch', async () => {
    expect(await collector.fetch(callCluster)).toEqual(getCoreUsageDataReturnValue);
  });
});
