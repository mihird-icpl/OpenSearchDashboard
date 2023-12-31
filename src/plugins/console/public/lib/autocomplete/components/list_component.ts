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
import { SharedComponent } from './shared_component';
import { CoreEditor } from '../../../types';
import { AutoCompleteContext, Term } from '../types';

type ListGenerator = (...args: any[]) => Term[];
/** A component that suggests one of the give options, but accepts anything */
export class ListComponent extends SharedComponent {
  listGenerator: ListGenerator;
  multiValued: boolean;
  allowNonValidValues: boolean;

  constructor(
    name: string,
    list: string[] | ListGenerator,
    parent: SharedComponent,
    multiValued?: boolean,
    allowNonValidValues?: boolean
  ) {
    super(name, parent);
    this.listGenerator = Array.isArray(list)
      ? function () {
          return list;
        }
      : list;
    this.multiValued = _.isUndefined(multiValued) ? true : multiValued;
    this.allowNonValidValues = _.isUndefined(allowNonValidValues) ? false : allowNonValidValues;
  }
  getTerms(context: AutoCompleteContext, editor: CoreEditor) {
    if (!this.multiValued && context.otherTokenValues) {
      // already have a value -> no suggestions
      return [];
    }
    let alreadySet = context.otherTokenValues || [];
    if (_.isString(alreadySet)) {
      alreadySet = [alreadySet];
    }
    let ret = _.difference(this.listGenerator(context, editor), alreadySet);

    if (this.getDefaultTermMeta()) {
      const meta = this.getDefaultTermMeta();
      ret = _.map(ret, function (term) {
        if (_.isString(term)) {
          term = { name: term };
        }
        return _.defaults(term, { meta });
      });
    }

    return ret;
  }

  validateTokens(tokens: string[]): boolean {
    if (!this.multiValued && tokens.length > 1) {
      return false;
    }

    // verify we have all tokens
    const list = this.listGenerator();
    const notFound = _.some(tokens, function (token) {
      return list.indexOf(token) === -1;
    });

    if (notFound) {
      return false;
    }
    return true;
  }

  getContextKey() {
    return this.name;
  }

  getDefaultTermMeta() {
    return this.name;
  }

  match(token: string | string[], context: AutoCompleteContext, editor: CoreEditor) {
    if (!Array.isArray(token)) {
      token = [token];
    }
    if (!this.allowNonValidValues && !this.validateTokens(token)) {
      return null;
    }

    const result = super.match(token, context, editor);
    if (result) {
      result.context_values = result.context_values || {};
      result.context_values[this.getContextKey()] = token;
    }
    return result;
  }
}
