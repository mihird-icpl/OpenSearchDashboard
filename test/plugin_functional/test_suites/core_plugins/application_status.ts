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
import {
  AppNavLinkStatus,
  AppStatus,
  AppUpdatableFields,
} from '../../../../src/core/public/application/types';
import { PluginFunctionalProviderContext } from '../../services';
import '../../plugins/core_app_status/public/types';

const getOpenSearchDashboardsUrl = (pathname?: string, search?: string) => {
  const url = new URL(
    pathname ?? '',
    `http://${process.env.TEST_OPENSEARCH_DASHBOARDS_HOST || 'localhost'}:${
      process.env.TEST_OPENSEARCH_DASHBOARDS_PORT || '5620'
    }`
  );
  if (search) {
    url.search = search;
  }
  return url.toString();
};

export default function ({ getService, getPageObjects }: PluginFunctionalProviderContext) {
  const PageObjects = getPageObjects(['common']);
  const browser = getService('browser');
  const appsMenu = getService('appsMenu');
  const retry = getService('retry');
  const testSubjects = getService('testSubjects');

  const setAppStatus = async (s: Partial<AppUpdatableFields>) => {
    return browser.executeAsync(async (status, cb) => {
      window._coreAppStatus.setAppStatus(status);
      cb();
    }, s);
  };

  const navigateToApp = async (id: string) => {
    return await browser.executeAsync(async (appId, cb) => {
      await window._coreAppStatus.navigateToApp(appId);
      cb();
    }, id);
  };

  describe('application status management', () => {
    beforeEach(async () => {
      await PageObjects.common.navigateToApp('app_status_start');
    });

    it('can change the navLink status at runtime', async () => {
      await setAppStatus({
        navLinkStatus: AppNavLinkStatus.disabled,
      });
      let link = await appsMenu.getLink('App Status');
      expect(link).not.to.eql(undefined);
      expect(link!.disabled).to.eql(true);

      await setAppStatus({
        navLinkStatus: AppNavLinkStatus.hidden,
      });
      link = await appsMenu.getLink('App Status');
      expect(link).to.eql(undefined);
    });

    it('shows an error when navigating to an inaccessible app', async () => {
      await setAppStatus({
        status: AppStatus.inaccessible,
      });

      await navigateToApp('app_status');

      expect(await testSubjects.exists('appNotFoundPageContent')).to.eql(true);
      expect(await testSubjects.exists('appStatusApp')).to.eql(false);
    });

    it('allows to navigate to an accessible app', async () => {
      await setAppStatus({
        status: AppStatus.accessible,
      });

      await navigateToApp('app_status');

      expect(await testSubjects.exists('appNotFoundPageContent')).to.eql(false);
      expect(await testSubjects.exists('appStatusApp')).to.eql(true);
    });

    it('allows to change the defaultPath of an application', async () => {
      const link = await appsMenu.getLink('App Status');
      expect(link!.href).to.eql(getOpenSearchDashboardsUrl('/app/app_status'));

      await setAppStatus({
        defaultPath: '/arbitrary/path',
      });

      await retry.waitFor('link url updated with "defaultPath"', async () => {
        const updatedLink = await appsMenu.getLink('App Status');
        return updatedLink?.href === getOpenSearchDashboardsUrl('/app/app_status/arbitrary/path');
      });

      await navigateToApp('app_status');
      expect(await testSubjects.exists('appStatusApp')).to.eql(true);
      const currentUrl = await browser.getCurrentUrl();
      expect(new URL('', currentUrl).pathname).to.eql('/app/app_status/arbitrary/path');
    });

    it('can change the state of the currently mounted app', async () => {
      await setAppStatus({
        status: AppStatus.accessible,
      });

      await navigateToApp('app_status');

      expect(await testSubjects.exists('appNotFoundPageContent')).to.eql(false);
      expect(await testSubjects.exists('appStatusApp')).to.eql(true);

      await setAppStatus({
        status: AppStatus.inaccessible,
      });

      expect(await testSubjects.exists('appNotFoundPageContent')).to.eql(true);
      expect(await testSubjects.exists('appStatusApp')).to.eql(false);

      await setAppStatus({
        status: AppStatus.accessible,
      });

      expect(await testSubjects.exists('appNotFoundPageContent')).to.eql(false);
      expect(await testSubjects.exists('appStatusApp')).to.eql(true);
    });
  });
}
