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

import { coreMock } from '../../../core/public/mocks';
import { homePluginMock } from '../../home/public/mocks';
import { managementPluginMock } from '../../management/public/mocks';
import { dataPluginMock } from '../../data/public/mocks';
import { uiActionsPluginMock } from '../../ui_actions/public/mocks';
import { SavedObjectsManagementPlugin } from './plugin';

describe('SavedObjectsManagementPlugin', () => {
  let plugin: SavedObjectsManagementPlugin;

  beforeEach(() => {
    plugin = new SavedObjectsManagementPlugin();
  });

  describe('#setup', () => {
    it('registers the saved_objects feature to the home plugin', async () => {
      const coreSetup = coreMock.createSetup({
        pluginStartDeps: { data: dataPluginMock.createStartContract() },
      });
      const homeSetup = homePluginMock.createSetupContract();
      const managementSetup = managementPluginMock.createSetupContract();
      const uiActionsSetup = uiActionsPluginMock.createSetupContract();

      await plugin.setup(coreSetup, {
        home: homeSetup,
        management: managementSetup,
        uiActions: uiActionsSetup,
      });

      expect(homeSetup.featureCatalogue.register).toHaveBeenCalledTimes(1);
      expect(homeSetup.featureCatalogue.register).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'saved_objects',
        })
      );
    });
  });
});
