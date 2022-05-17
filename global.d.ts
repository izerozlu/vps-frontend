import { IntlifyModuleOptions } from '@intlify/nuxt3';

declare module '@nuxt/schema' {
  export interface NuxtConfig {
    intlify?: IntlifyModuleOptions;
  }
}
