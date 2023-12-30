import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import { ConfigurationPluginSetup, ConfigurationPluginStart } from './types';
import { defineRoutes } from './routes';

export class ConfigurationPlugin
  implements Plugin<ConfigurationPluginSetup, ConfigurationPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.debug('configurationplugin: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('configurationplugin: Started');
    return {};
  }

  public stop() {}
}
