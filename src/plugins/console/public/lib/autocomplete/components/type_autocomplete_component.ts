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

import _ from 'lodash';
import { ListComponent } from './list_component';
import { getTypes } from '../../mappings/mappings';
import { AutoCompleteContext } from '../types';

function TypeGenerator(context: AutoCompleteContext) {
  return getTypes(context.indices);
}
function nonValidIndexType(token: string) {
  return !(token === '_all' || token[0] !== '_');
}
export class TypeAutocompleteComponent extends ListComponent {
  constructor(name: string, parent: ListComponent, multiValued?: boolean) {
    super(name, TypeGenerator, parent, multiValued);
  }
  validateTokens(tokens: string[]) {
    if (!this.multiValued && tokens.length > 1) {
      return false;
    }

    return !_.find(tokens, nonValidIndexType);
  }

  getDefaultTermMeta() {
    return 'type';
  }

  getContextKey() {
    return 'types';
  }
}
