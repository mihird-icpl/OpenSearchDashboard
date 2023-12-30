import { PluginInitializerContext } from '../../../src/core/server';
import { PolicyinvinsensePlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new PolicyinvinsensePlugin(initializerContext);
}

export { PolicyPluginSetup, PolicyPluginStart } from './types';
