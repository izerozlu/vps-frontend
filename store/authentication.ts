import { defineStore } from 'pinia';
import EAuthentication from '@/enums/authentication';

const useAuthenticationStore = defineStore('authentication', {
  state: () => {
    return {
      isLoggedIn: useCookie(EAuthentication.IS_LOGGED_IN).value === 'true',
    };
  },
  actions: {
    login() {
      this.isLoggedIn = true;
    },
    logout() {
      this.isLoggedIn = false;
    },
  },
});

export default useAuthenticationStore;
