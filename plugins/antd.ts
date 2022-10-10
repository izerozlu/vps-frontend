import { defineNuxtPlugin } from '#app';
import {
  DatePicker,
  Input,
  ConfigProvider,
  Select,
  Switch,
  Button,
  Table,
  SelectOption,
  Tooltip,
  Upload,
  TimePicker,
  Modal,
} from 'ant-design-vue/lib';

export default defineNuxtPlugin(({ vueApp: app }) => {
  app.component('AntInput', Input);
  app.component('AntDatePicker', DatePicker);
  app.component('AntConfigProvider', ConfigProvider);
  app.component('AntSelect', Select);
  app.component('AntSelectOption', SelectOption);
  app.component('AntSwitch', Switch);
  app.component('AntButton', Button);
  app.component('AntTable', Table);
  app.component('AntTooltip', Tooltip);
  app.component('AntUpload', Upload);
  app.component('AntTimePicker', TimePicker);
  app.component('AntModal', Modal);
});
