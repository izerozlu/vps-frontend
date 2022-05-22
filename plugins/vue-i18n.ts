import { createI18n } from 'vue-i18n';
import tr from '@/locales/tr.json';

export const i18n = createI18n({
  locale: 'tr',
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    tr,
  },
});

export default defineNuxtPlugin(({ vueApp: app }) => {
  app.use(i18n);
});
