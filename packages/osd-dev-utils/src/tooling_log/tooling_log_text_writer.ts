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

import { format } from 'util';

import chalk from 'chalk';

import { LogLevel, parseLogLevel, ParsedLogLevel } from './log_levels';
import { Writer } from './writer';
import { Message, MessageTypes } from './message';

const { magentaBright, yellow, red, blue, green, dim } = chalk;
const PREFIX_INDENT = ' '.repeat(6);
const MSG_PREFIXES = {
  verbose: ` ${magentaBright('sill')} `,
  debug: ` ${dim('debg')} `,
  info: ` ${blue('info')} `,
  success: ` ${green('succ')} `,
  warning: ` ${yellow('warn')} `,
  error: `${red('ERROR')} `,
};

const has = <T extends object>(obj: T, key: any): key is keyof T => obj.hasOwnProperty(key);

export interface ToolingLogTextWriterConfig {
  level: LogLevel;
  writeTo: {
    write(s: string): void;
  };
}

function shouldWriteType(level: ParsedLogLevel, type: MessageTypes) {
  if (type === 'write') {
    return level.name !== 'silent';
  }

  return Boolean(level.flags[type === 'success' ? 'info' : type]);
}

function stringifyError(error: string | Error) {
  if (typeof error !== 'string' && !(error instanceof Error)) {
    error = new Error(`"${error}" thrown`);
  }

  if (typeof error === 'string') {
    return error;
  }

  return error.stack || error.message || error;
}

export class ToolingLogTextWriter implements Writer {
  public readonly level: ParsedLogLevel;
  public readonly writeTo: {
    write(msg: string): void;
  };

  constructor(config: ToolingLogTextWriterConfig) {
    this.level = parseLogLevel(config.level);
    this.writeTo = config.writeTo;

    if (!this.writeTo || typeof this.writeTo.write !== 'function') {
      throw new Error(
        'ToolingLogTextWriter requires the `writeTo` option be set to a stream (like process.stdout)'
      );
    }
  }

  write(msg: Message) {
    if (!shouldWriteType(this.level, msg.type)) {
      return false;
    }

    const prefix = has(MSG_PREFIXES, msg.type) ? MSG_PREFIXES[msg.type] : '';
    ToolingLogTextWriter.write(this.writeTo, prefix, msg);
    return true;
  }

  static write(writeTo: ToolingLogTextWriter['writeTo'], prefix: string, msg: Message) {
    const txt =
      msg.type === 'error'
        ? stringifyError(msg.args[0])
        : format(msg.args[0], ...msg.args.slice(1));

    (prefix + txt).split('\n').forEach((line, i) => {
      let lineIndent = '';

      if (msg.indent > 0) {
        // if we are indenting write some spaces followed by a symbol
        lineIndent += ' '.repeat(msg.indent - 1);
        lineIndent += line.startsWith('-') ? '└' : '│';
      }

      if (line && prefix && i > 0) {
        // apply additional indentation to lines after
        // the first if this message gets a prefix
        lineIndent += PREFIX_INDENT;
      }

      writeTo.write(`${lineIndent}${line}\n`);
    });
  }
}
