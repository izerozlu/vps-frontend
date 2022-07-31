import { defineNuxtConfig } from 'nuxt';
import svgLoader from 'vite-svg-loader';
import path from 'path';
import vueI18n from '@intlify/vite-plugin-vue-i18n';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['@pinia/nuxt', 'nuxt-windicss'],
  ssr: false,
  css: [
    'ant-design-vue/dist/antd.css',
    'vue-toastification/dist/index.css',
    '~/assets/styles/main.scss',
    '~/assets/styles/fonts.scss'
  ],
  build: {
    transpile: ['primevue']
  },
  // @ts-ignore: vite-svg-loader has to be included via vite.plugins congiguration but something is off with types
  // https://github.com/nuxt-community/svg-module/issues/86#issuecomment-944341678
  vite: {
    plugins: [
      svgLoader(),
      vueI18n({
        include: path.resolve(__dirname, './locales/**')
      })
    ]
  },
  publicRuntimeConfig: {
    baseUrl: process.env.VPS_API_IP_ADDRESS && process.env.VPS_API_PORT ?
      `http://${process.env.VPS_API_IP_ADDRESS}:${process.env.VPS_API_PORT}` :
      'http://localhost:8090'
  }
});
