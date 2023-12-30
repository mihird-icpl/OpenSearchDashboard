import './index.scss';

import { ConfigurationPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.
export function plugin() {
  return new ConfigurationPlugin();
}
export { ConfigurationPluginSetup, ConfigurationPluginStart } from './types';
