import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

export interface PolicyPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PolicyPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}
