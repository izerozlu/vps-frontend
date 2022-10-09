import { defineNuxtConfig } from 'nuxt';
import svgLoader from 'vite-svg-loader';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'url';
import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['@pinia/nuxt', 'nuxt-windicss'],
  ssr: false,
  css: [
    'ant-design-vue/dist/antd.css',
    'vue-toastification/dist/index.css',
    '~/assets/styles/main.scss',
    '~/assets/styles/fonts.scss',
  ],
  build: {
    transpile: ['primevue'],
  },

  vite: {
    resolve: {
      alias: {
        'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
      },
    },
    plugins: [
      // @ts-ignore: vite-svg-loader has to be included via vite.plugins configuration but something is off with types
      // https://github.com/nuxt-community/svg-module/issues/86#issuecomment-944341678
      svgLoader(),
      VueI18nVitePlugin({
        include: resolve(
          dirname(fileURLToPath(import.meta.url)),
          './locales/*.json'
        ),
      }),
    ],
  },
  publicRuntimeConfig: {
    baseUrl:
      process.env.VPS_API_IP_ADDRESS && process.env.VPS_API_PORT
        ? `http://${process.env.VPS_API_IP_ADDRESS}:${process.env.VPS_API_PORT}`
        : 'http://localhost:8090',
  },
});
