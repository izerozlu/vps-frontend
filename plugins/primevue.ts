import { defineNuxtPlugin } from '#app';
import PrimeVue from 'primevue/config';
import ProgressBar from 'primevue/progressbar';

export default defineNuxtPlugin(({ vueApp: app }) => {
  app.use(PrimeVue, { ripple: true });
  app.component('ProgressBar', ProgressBar);
});
