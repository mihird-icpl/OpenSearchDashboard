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

import { Reducer } from 'react';
import { produce } from 'immer';
import { identity } from 'fp-ts/lib/function';
import { BaseResponseType } from '../../types/common';
import { OpenSearchRequestResult } from '../hooks/use_send_current_request_to_opensearch/send_request_to_opensearch';

export type Actions =
  | { type: 'sendRequest'; payload: undefined }
  | { type: 'requestSuccess'; payload: { data: OpenSearchRequestResult[] } }
  | { type: 'requestFail'; payload: OpenSearchRequestResult<string> | undefined }
  | { type: 'resetLastResult'; payload: undefined };

export interface Store {
  requestInFlight: boolean;
  lastResult: {
    data: OpenSearchRequestResult[] | null;
    error?: OpenSearchRequestResult<string>;
  };
}

const initialResultValue = {
  data: null,
  type: 'unknown' as BaseResponseType,
};

export const initialValue: Store = produce<Store>(
  {
    requestInFlight: false,
    lastResult: initialResultValue,
  },
  identity
);

export const reducer: Reducer<Store, Actions> = (state, action) =>
  produce<Store>(state, (draft) => {
    if (action.type === 'sendRequest') {
      draft.requestInFlight = true;
      draft.lastResult = initialResultValue;
      return;
    }

    if (action.type === 'requestSuccess') {
      draft.requestInFlight = false;
      draft.lastResult = action.payload;
      return;
    }

    if (action.type === 'requestFail') {
      draft.requestInFlight = false;
      draft.lastResult = { ...initialResultValue, error: action.payload };
      return;
    }

    if (action.type === 'resetLastResult') {
      draft.lastResult = initialResultValue;
      return;
    }

    return draft;
  });
