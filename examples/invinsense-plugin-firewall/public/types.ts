import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

export interface SecurityPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SecurityPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}
