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

export default defineNuxtPlugin(({ vueApp: app }) => {
  app.component('AntInput', Input);
  app.component('AntDatePicker', DatePicker);
  app.component('AntConfigProvider', ConfigProvider);
  app.component('AntSelect', Select);
  app.component('AntSwitch', Switch);
  app.component('AntButton', Button);
  app.component('AntTable', Table);
});
