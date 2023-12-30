import './index.scss';

import { PolicyinvinsensePlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.
export function plugin() {
  return new PolicyinvinsensePlugin();
}
export { PolicyPluginSetup, PolicyPluginStart } from './types';
