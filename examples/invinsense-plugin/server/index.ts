import { PluginInitializerContext } from '../../../src/core/server';
import { TestinvinsensePlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new TestinvinsensePlugin(initializerContext);
}

export { TestinvinsensePluginSetup, TestinvinsensePluginStart } from './types';
