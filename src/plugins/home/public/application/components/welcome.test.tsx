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

import React from 'react';
import { shallow } from 'enzyme';
import { Welcome } from './welcome';
import { telemetryPluginMock } from '../../../../telemetry/public/mocks';
import { getLogosMock } from '../../../../../core/common/mocks';

jest.mock('../opensearch_dashboards_services', () => ({
  getServices: () => ({
    addBasePath: (path: string) => `root${path}`,
    trackUiMetric: () => {},
  }),
}));
/*
test('should render a Welcome screen with the telemetry disclaimer', () => {
  const telemetry = telemetryPluginMock.createStartContract();
  const component = shallow(<Welcome urlBasePath="/" onSkip={() => {}} telemetry={telemetry} />);

  expect(component).toMatchSnapshot();
});
*/

const mockTitle = 'Page Title';
const makeProps = () => ({
  urlBasePath: '/',
  onSkip: jest.fn(),
  branding: {
    applicationTitle: mockTitle,
  },
  logos: getLogosMock.default,
});

describe('Welcome page', () => {
  describe('renders the Welcome screen', () => {
    it('with the telemetry disclaimer when optIn is true', () => {
      const telemetry = telemetryPluginMock.createStartContract();
      telemetry.telemetryService.getIsOptedIn = jest.fn().mockReturnValue(true);

      const props = {
        ...makeProps(),
        telemetry,
      };
      const component = shallow(<Welcome {...props} />);
      expect(component).toMatchSnapshot();
    });

    it('with the telemetry disclaimer when optIn is false', () => {
      const telemetry = telemetryPluginMock.createStartContract();
      telemetry.telemetryService.getIsOptedIn = jest.fn().mockReturnValue(false);

      const props = {
        ...makeProps(),
        telemetry,
      };
      const component = shallow(<Welcome {...props} />);
      expect(component).toMatchSnapshot();
    });

    it('with no telemetry disclaimer', () => {
      const props = {
        ...makeProps(),
      };
      const component = shallow(<Welcome {...props} />);
      expect(component).toMatchSnapshot();
    });

    it('and fires opt-in seen when mounted', () => {
      const telemetry = telemetryPluginMock.createStartContract();
      const mockSetOptedInNoticeSeen = jest.fn();
      telemetry.telemetryNotifications.setOptedInNoticeSeen = mockSetOptedInNoticeSeen;

      const props = {
        ...makeProps(),
        telemetry,
      };
      shallow(<Welcome {...props} />);

      expect(mockSetOptedInNoticeSeen).toHaveBeenCalled();
    });
  });

  describe('renders the welcome logo', () => {
    it('with OpenSearch center mark when not branded', () => {
      const props = {
        ...makeProps(),
      };
      const component = shallow(<Welcome {...props} />);

      const elements = component.find('EuiIcon');
      expect(elements.length).toEqual(1);
      expect(elements.first().prop('type')).toEqual(props.logos.CenterMark.url);

      expect(component).toMatchSnapshot();
    });

    it('with custom branded logo when branded', () => {
      const props = {
        ...makeProps(),
        logos: getLogosMock.branded,
      };
      const component = shallow(<Welcome {...props} />);

      const elements = component.find({
        'data-test-subj': 'welcomeCustomLogo',
      });
      expect(elements.length).toEqual(1);

      const img = elements.first();
      expect(img.prop('src')).toEqual(props.logos.CenterMark.url);
      expect(img.prop('alt')).toEqual(`${mockTitle} logo`);

      expect(component).toMatchSnapshot();
    });
  });
});
