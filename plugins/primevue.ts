import { defineNuxtPlugin } from '#app';
import PrimeVue from 'primevue/config';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';
import Card from 'primevue/card';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, { ripple: true });
  nuxtApp.vueApp.component('InputText', InputText);
  nuxtApp.vueApp.component('Button', Button);
  nuxtApp.vueApp.component('ProgressBar', ProgressBar);
  nuxtApp.vueApp.component('Card', Card);
});
