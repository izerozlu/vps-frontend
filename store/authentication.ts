import { defineStore } from 'pinia';
import EAuthentication from '@/enums/authentication';

const useAuthenticationStore = defineStore('authentication', {
  state: () => {
    return {
      isLoggedIn: useCookie(EAuthentication.IS_LOGGED_IN).value === 'true',
      username: useCookie(EAuthentication.USERNAME).value,
    };
  },
  actions: {
    async login(username: string, password: string) {
      await handleResponse(
        $fetch<{ status: 'success' | 'fail' }>('/api/authentication/login', {
          method: 'POST',
          body: { username, password },
        }),
        {
          success: () => {
            this.username = username;
            this.isLoggedIn = true;
          },
        }
      );
    },
    async logout() {
      if (this.username) {
        await handleResponse(
          $fetch<{ status: 'success' | 'fail' }>('/api/authentication/logout', {
            method: 'POST',
            body: { username: this.username },
          }),
          {
            success: () => {
              this.username = null;
              this.isLoggedIn = false;
            },
          }
        );
      }
    },
  },
});

export default useAuthenticationStore;
