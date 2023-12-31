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

import expect from '@osd/expect';
import { PluginFunctionalProviderContext } from '../../services';
import '../../plugins/core_provider_plugin/types';

export default function ({ getService, getPageObjects }: PluginFunctionalProviderContext) {
  const PageObjects = getPageObjects(['common']);
  const browser = getService('browser');
  const supertest = getService('supertest');

  describe('ui settings', function () {
    before(async () => {
      await PageObjects.common.navigateToApp('settings');
    });

    it('client plugins have access to registered settings', async () => {
      const settings = await browser.execute(() => {
        return window._coreProvider.setup.core.uiSettings.getAll().ui_settings_plugin;
      });

      expect(settings).to.eql({
        category: ['any'],
        description: 'just for testing',
        name: 'from_ui_settings_plugin',
        value: '2',
      });

      const settingsValue = await browser.execute(() => {
        return window._coreProvider.setup.core.uiSettings.get('ui_settings_plugin');
      });

      expect(settingsValue).to.be('2');

      const settingsValueViaObservables = await browser.executeAsync(async (callback) => {
        window._coreProvider.setup.core.uiSettings
          .get$('ui_settings_plugin')
          .subscribe((v) => callback(v));
      });

      expect(settingsValueViaObservables).to.be('2');
    });

    it('server plugins have access to registered settings', async () => {
      const result = await supertest.get('/api/ui-settings-plugin');
      expect(result.statusCode).to.be(200);
      expect(Object.keys(result.body).length).to.be(1);
      expect(Number(result.body.uiSettingsValue)).to.be(2);
    });
  });
}
