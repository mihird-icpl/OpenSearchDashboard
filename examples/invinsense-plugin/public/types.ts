import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

export interface TestinvinsensePluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TestinvinsensePluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}
