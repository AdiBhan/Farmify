/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)/login` | `/(auth)/register` | `/(tabs)` | `/(tabs)/Auction` | `/(tabs)/auction` | `/(tabs)/buyerSettings/updateContact` | `/(tabs)/buyerSettings/updatePaymentInfo` | `/(tabs)/details` | `/(tabs)/newlisting` | `/(tabs)/settings` | `/(tabs)/stats` | `/(tabs)/transactions` | `/Auction` | `/_sitemap` | `/auction` | `/buyerSettings/updateContact` | `/buyerSettings/updatePaymentInfo` | `/details` | `/login` | `/newlisting` | `/register` | `/settings` | `/stats` | `/styles` | `/stylesAuction` | `/stylesDetails` | `/transactions`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}