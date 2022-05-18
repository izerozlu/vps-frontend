import EAuthentication from '@/enums/authentication';
import ERoutes from '@/enums/routes';

export default defineNuxtRouteMiddleware((to, from) => {
  const isLoggedInCookie = useCookie(EAuthentication.IS_LOGGED_IN);
  const authenticationRouteName = 'authentication';

  if (!isLoggedInCookie.value && to.path !== ERoutes.AUTHENTICATION) {
    return navigateTo(ERoutes.AUTHENTICATION);
  }

  if (
    to.name.toString().toLowerCase() === authenticationRouteName &&
    isLoggedInCookie.value
  ) {
    return navigateTo(ERoutes.PATIENT_LIST);
  }
});
