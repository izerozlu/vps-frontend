import Toast from 'vue-toastification';

export default defineNuxtPlugin(({ vueApp: app }) => {
  app.use(Toast, {
    position: 'bottom-right',
  });
});
