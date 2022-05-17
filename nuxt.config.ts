import { defineNuxtConfig } from 'nuxt';
import svgLoader from 'vite-svg-loader';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['@pinia/nuxt', 'nuxt-windicss', '@intlify/nuxt3'],
  css: [
    'ant-design-vue/dist/antd.css',
    'vue-toastification/dist/index.css',
    '~/assets/styles/main.scss',
    '~/assets/styles/fonts.scss',
  ],
  build: {
    transpile: ['primevue'],
  },
  // @ts-ignore: vite-svg-loader has to be included via vite.plugins congiguration but something is off with types
  // https://github.com/nuxt-community/svg-module/issues/86#issuecomment-944341678
  vite: {
    plugins: [svgLoader()],
  },
  // @ts-ignore
  intlify: {
    vueI18n: {
      locale: 'tr',
      missingWarn: false,
      fallbackWarn: false,
    },
  },
});
