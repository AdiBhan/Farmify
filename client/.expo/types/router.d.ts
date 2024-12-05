/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)/login` | `/(auth)/register` | `/(tabs)` | `/(tabs)/auction` | `/(tabs)/buyerSettings/updateAccountInfo` | `/(tabs)/buyerSettings/updateContact` | `/(tabs)/buyerSettings/updatePaymentInfo` | `/(tabs)/checkout` | `/(tabs)/details` | `/(tabs)/newlisting` | `/(tabs)/settings` | `/(tabs)/stats` | `/(tabs)/transactions` | `/_sitemap` | `/auction` | `/buyerSettings/updateAccountInfo` | `/buyerSettings/updateContact` | `/buyerSettings/updatePaymentInfo` | `/checkout` | `/details` | `/login` | `/newlisting` | `/register` | `/sellerSettings/updateAccountInfo` | `/sellerSettings/updateBusinessInfo` | `/settings` | `/stats` | `/styles` | `/stylesAuction` | `/stylesDetails` | `/stylesSettings` | `/transactions`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
