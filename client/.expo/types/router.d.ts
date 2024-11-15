/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)/login` | `/(auth)/register` | `/(tabs)` | `/(tabs)/auction` | `/(tabs)/details` | `/(tabs)/newlisting` | `/(tabs)/settings` | `/(tabs)/stats` | `/(tabs)/transactions` | `/_sitemap` | `/auction` | `/details` | `/login` | `/newlisting` | `/register` | `/settings` | `/stats` | `/styles` | `/stylesAuction` | `/stylesDetails` | `/transactions`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
