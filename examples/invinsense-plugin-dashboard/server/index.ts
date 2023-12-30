import { PluginInitializerContext } from '../../../src/core/server';
import { ConfigurationPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new ConfigurationPlugin(initializerContext);
}

export { ConfigurationPluginSetup, ConfigurationPluginStart } from './types';
