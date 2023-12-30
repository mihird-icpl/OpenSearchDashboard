import { PluginInitializerContext } from '../../../src/core/server';
import { GroupManagerPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new GroupManagerPlugin(initializerContext);
}

export { GroupManagerPluginSetup, GroupManagerPluginStart } from './types';
