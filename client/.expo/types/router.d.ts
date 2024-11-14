/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)/login` | `/(auth)/register` | `/(tabs)` | `/(tabs)/auction` | `/(tabs)/settings` | `/_sitemap` | `/auction` | `/login` | `/register` | `/settings` | `/styles` | `/stylesAuction`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
