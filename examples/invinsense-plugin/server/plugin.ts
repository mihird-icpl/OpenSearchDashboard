import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import { TestinvinsensePluginSetup, TestinvinsensePluginStart } from './types';
import { defineRoutes } from './routes';

export class TestinvinsensePlugin
  implements Plugin<TestinvinsensePluginSetup, TestinvinsensePluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.debug('testinvinsense: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('testinvinsense: Started');
    return {};
  }

  public stop() {}
}
