import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import { GroupManagerPluginSetup, GroupManagerPluginStart } from './types';
import { defineRoutes } from './routes';

export class GroupManagerPlugin implements Plugin<GroupManagerPluginSetup, GroupManagerPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.debug('groupmanager: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('groupmanager: Started');
    return {};
  }

  public stop() {}
}
