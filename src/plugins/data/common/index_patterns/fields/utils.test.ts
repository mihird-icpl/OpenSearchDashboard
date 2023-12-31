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

import { isFilterable } from '..';
import { IFieldType } from '.';

const mockField = {
  name: 'foo',
  scripted: false,
  searchable: true,
  type: 'string',
} as IFieldType;

describe('isFilterable', () => {
  describe('types', () => {
    it('should return true for filterable types', () => {
      ['string', 'number', 'date', 'ip', 'boolean'].forEach((type) => {
        expect(isFilterable({ ...mockField, type })).toBe(true);
      });
    });

    it('should return false for filterable types if the field is not searchable', () => {
      ['string', 'number', 'date', 'ip', 'boolean'].forEach((type) => {
        expect(isFilterable({ ...mockField, type, searchable: false })).toBe(false);
      });
    });

    it('should return false for un-filterable types', () => {
      ['geo_point', 'geo_shape', 'attachment', 'murmur3', '_source', 'unknown', 'conflict'].forEach(
        (type) => {
          expect(isFilterable({ ...mockField, type })).toBe(false);
        }
      );
    });
  });

  it('should return true for scripted fields', () => {
    expect(isFilterable({ ...mockField, scripted: true, searchable: false })).toBe(true);
  });

  it('should return true for the _id field', () => {
    expect(isFilterable({ ...mockField, name: '_id' })).toBe(true);
  });
});
