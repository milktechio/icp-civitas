import { AuthClient } from '@dfinity/auth-client';
import { acceptHMRUpdate, defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    isAdmin: false,
    principalId: null as string | null,
  }),

  actions: {
    async login() {
      const app = useNuxtApp();

      try {
        const authClient = await AuthClient.create();

        authClient.login({
          // 7 days in nanoseconds
          maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
          onSuccess: async () => {
            await this.initAuthClient();
            app.callHook('auth:logged-in');
          },
        });
      } catch (error) {
        console.error('(login): Error on auth client:', error);
      }
    },

    async logout() {
      try {
        const authClient = await AuthClient.create();
        await authClient.logout();
        this.isLoggedIn = false;
      } catch (error) {
        console.error('(logout): Error on auth client:', error);
      }
    },

    async initAuthClient() {
      try {
        const authClient = await AuthClient.create();
        const isAuthenticated = await authClient.isAuthenticated();

        if (isAuthenticated) {
          const principal = authClient.getIdentity().getPrincipal();

          if (!principal.isAnonymous()) {
            this.isLoggedIn = true;
            this.principalId = principal.toText();
            return;
          }
        }

        this.isLoggedIn = false;
        this.principalId = null;
      } catch (error) {
        console.error('(initAuthClient): Error on auth client:', error);
      }
    },
  },
});

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
