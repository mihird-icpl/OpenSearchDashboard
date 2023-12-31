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
import { shallowWithIntl, mountWithIntl } from 'test_utils/enzyme_helpers';
import { findTestSubject } from 'test_utils/helpers';
import { getDepsMock, getIndexPatternMock } from '../../test_utils';
import { ControlsTab, ControlsTabUiProps } from './controls_tab';
import { Vis } from '../../../../visualizations/public';

const indexPatternsMock = {
  get: getIndexPatternMock,
};
let props: ControlsTabUiProps;

beforeEach(() => {
  props = {
    deps: getDepsMock(),
    vis: ({
      API: {
        indexPatterns: indexPatternsMock,
      },
      type: {
        name: 'test',
        title: 'test',
        visualization: null,
        requestHandler: 'test',
        responseHandler: 'test',
        stage: 'beta',
        requiresSearch: false,
        hidden: false,
      },
    } as unknown) as Vis,
    stateParams: {
      controls: [
        {
          id: '1',
          indexPattern: 'indexPattern1',
          fieldName: 'keywordField',
          label: 'custom label',
          type: 'list',
          options: {
            type: 'terms',
            multiselect: true,
            size: 5,
            order: 'desc',
          },
          parent: 'parent',
        },
        {
          id: '2',
          indexPattern: 'indexPattern1',
          fieldName: 'numberField',
          label: '',
          type: 'range',
          options: {
            step: 1,
          },
          parent: 'parent',
        },
      ],
    },
    setValue: jest.fn(),
    intl: null as any,
  };
});

test('renders ControlsTab', () => {
  const component = shallowWithIntl(<ControlsTab.WrappedComponent {...props} />);

  expect(component).toMatchSnapshot();
});

describe('behavior', () => {
  test('add control button', () => {
    const component = mountWithIntl(<ControlsTab.WrappedComponent {...props} />);

    findTestSubject(component, 'inputControlEditorAddBtn').simulate('click');

    // // Use custom match function since control.id is dynamically generated and never the same.
    expect(props.setValue).toHaveBeenCalledWith(
      'controls',
      expect.arrayContaining(props.stateParams.controls)
    );
    expect((props.setValue as jest.Mock).mock.calls[0][1].length).toEqual(3);
  });

  test('remove control button', () => {
    const component = mountWithIntl(<ControlsTab.WrappedComponent {...props} />);
    findTestSubject(component, 'inputControlEditorRemoveControl0').simulate('click');
    const expectedParams = [
      'controls',
      [
        {
          id: '2',
          indexPattern: 'indexPattern1',
          fieldName: 'numberField',
          label: '',
          type: 'range',
          parent: 'parent',
          options: {
            step: 1,
          },
        },
      ],
    ];

    expect(props.setValue).toHaveBeenCalledWith(...expectedParams);
  });

  test('move down control button', () => {
    const component = mountWithIntl(<ControlsTab.WrappedComponent {...props} />);
    findTestSubject(component, 'inputControlEditorMoveDownControl0').simulate('click');
    const expectedParams = [
      'controls',
      [
        {
          id: '2',
          indexPattern: 'indexPattern1',
          fieldName: 'numberField',
          label: '',
          type: 'range',
          parent: 'parent',
          options: {
            step: 1,
          },
        },
        {
          id: '1',
          indexPattern: 'indexPattern1',
          fieldName: 'keywordField',
          label: 'custom label',
          type: 'list',
          parent: 'parent',
          options: {
            type: 'terms',
            multiselect: true,
            size: 5,
            order: 'desc',
          },
        },
      ],
    ];

    expect(props.setValue).toHaveBeenCalledWith(...expectedParams);
  });

  test('move up control button', () => {
    const component = mountWithIntl(<ControlsTab.WrappedComponent {...props} />);
    findTestSubject(component, 'inputControlEditorMoveUpControl1').simulate('click');
    const expectedParams = [
      'controls',
      [
        {
          id: '2',
          indexPattern: 'indexPattern1',
          fieldName: 'numberField',
          label: '',
          type: 'range',
          parent: 'parent',
          options: {
            step: 1,
          },
        },
        {
          id: '1',
          indexPattern: 'indexPattern1',
          fieldName: 'keywordField',
          label: 'custom label',
          type: 'list',
          parent: 'parent',
          options: {
            type: 'terms',
            multiselect: true,
            size: 5,
            order: 'desc',
          },
        },
      ],
    ];

    expect(props.setValue).toHaveBeenCalledWith(...expectedParams);
  });
});
