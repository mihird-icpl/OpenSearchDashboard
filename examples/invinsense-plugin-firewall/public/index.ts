import './index.scss';

import { TestinvinsensePlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.
export function plugin() {
  return new TestinvinsensePlugin();
}
export { SecurityPluginSetup, SecurityPluginStart } from './types';
