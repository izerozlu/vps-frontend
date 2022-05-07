import EAuthentication from '@/enums/authentication';
import ERoutes from '@/enums/routes';

export default defineNuxtRouteMiddleware((to, from) => {
  const isLoggedInCookie = useCookie(EAuthentication.IS_LOGGED_IN);

  if (!isLoggedInCookie.value && to.name !== 'authentication') {
    return navigateTo(ERoutes.AUTHENTICATION);
  }

  if (to.name === 'authentication' && isLoggedInCookie.value) {
    return navigateTo(ERoutes.PATIENT_LIST);
  }
});
