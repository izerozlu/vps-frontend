import ERoutes from '@/enums/routes';

export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === ERoutes.INDEX) {
    return navigateTo(ERoutes.PATIENT_LIST);
  }
});
