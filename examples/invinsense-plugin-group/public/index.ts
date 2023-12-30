import './index.scss';

import { GroupManagerPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.
export function plugin() {
  return new GroupManagerPlugin();
}
export { GroupManagerPluginSetup, GroupManagerPluginStart } from './types';
