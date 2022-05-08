import { defineNuxtPlugin } from '#app';
import PrimeVue from 'primevue/config';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

export default defineNuxtPlugin(({ vueApp: app }) => {
  app.use(PrimeVue, { ripple: true });
  app.component('InputText', InputText);
  app.component('Button', Button);
  app.component('ProgressBar', ProgressBar);
  app.component('DataTable', DataTable);
  app.component('Column', Column);
});
