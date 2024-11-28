/**
 * This middleware runs on every route change to ensure
 * keep the user logged in if possible.
 */
export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();

  if (authStore.isLoggedIn) return;
  await authStore.initAuthClient();
});
