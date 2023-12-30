import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

export interface GroupManagerPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GroupManagerPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}
