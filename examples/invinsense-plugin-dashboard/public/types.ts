import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

export interface ConfigurationPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConfigurationPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}
