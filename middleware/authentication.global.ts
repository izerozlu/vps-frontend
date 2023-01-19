import EAuthentication from '@/enums/authentication';
import ERoutes from '@/enums/routes';
import ERole from '@/enums/role';

export default defineNuxtRouteMiddleware((to) => {
  const authCookies = {
    isLoggedIn: useCookie(EAuthentication.IS_LOGGED_IN),
    username: useCookie(EAuthentication.USERNAME),
    role: useCookie(EAuthentication.ROLE)
  };
  const authenticationRouteName = 'authentication';
  const isAuthenticated =
    authCookies.isLoggedIn.value && authCookies.username.value;
  const basicRoutes = [ERoutes.SEARCH, ERoutes.PATIENT_DETAIL, ERoutes.AUTHENTICATION];

  if (!isAuthenticated && to.path !== ERoutes.AUTHENTICATION) {
    return navigateTo(ERoutes.AUTHENTICATION);
  }

  if (
    to.name.toString().toLowerCase() === authenticationRouteName &&
    isAuthenticated
  ) {
    return navigateTo(ERoutes.PATIENT_LIST);
  }

  if (!basicRoutes.includes(to.path) && authCookies.role.value !== ERole.EXPERT) {
    return navigateTo(ERoutes.SEARCH);
  }
});
