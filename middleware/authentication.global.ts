import EAuthentication from '@/enums/authentication';
import ERoutes from '@/enums/routes';

export default defineNuxtRouteMiddleware((to) => {
  const authCookies = {
    isLoggedIn: useCookie(EAuthentication.IS_LOGGED_IN),
    username: useCookie(EAuthentication.USERNAME),
  };
  const authenticationRouteName = 'authentication';
  const isAuthenticated =
    authCookies.isLoggedIn.value && authCookies.username.value;

  if (!isAuthenticated && to.path !== ERoutes.AUTHENTICATION) {
    return navigateTo(ERoutes.AUTHENTICATION);
  }
  
  if (
    to.name.toString().toLowerCase() === authenticationRouteName &&
    isAuthenticated
  ) {
    return navigateTo(ERoutes.PATIENT_LIST);
  }
});
