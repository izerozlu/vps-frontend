import { defineNuxtPlugin } from '#app';
import {
  DatePicker,
  Input,
  ConfigProvider,
  Select,
  Switch,
  Button,
  Table,
} from 'ant-design-vue/lib';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('AntInput', Input);
  nuxtApp.vueApp.component('AntDatePicker', DatePicker);
  nuxtApp.vueApp.component('AntConfigProvider', ConfigProvider);
  nuxtApp.vueApp.component('AntSelect', Select);
  nuxtApp.vueApp.component('AntSwitch', Switch);
  nuxtApp.vueApp.component('AntButton', Button);
  nuxtApp.vueApp.component('AntTable', Table);
});
