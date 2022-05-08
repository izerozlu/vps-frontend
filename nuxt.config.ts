import { defineNuxtConfig } from 'nuxt';
import svgLoader from 'vite-svg-loader';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['@pinia/nuxt', 'nuxt-windicss'],
  css: [
    '~/assets/styles/main.scss',
    '~/assets/styles/fonts.scss',
    'primevue/resources/themes/mdc-light-indigo/theme.css',
    'primevue/resources/primevue.css',
    'primeicons/primeicons.css',
  ],
  build: {
    transpile: ['primevue'],
  },
  // @ts-ignore: vite-svg-loader has to be included via vite.plugins congiguration but something is off with types
  // https://github.com/nuxt-community/svg-module/issues/86#issuecomment-944341678
  vite: {
    plugins: [svgLoader()],
  },
});
