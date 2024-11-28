/**
 * This middleware only allows authenticated users to go through
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  if (!authStore.isLoggedIn) {
    /**
     * User not authenticated. Try to redirect to their intended route after they log in
     */
    return navigateTo(
      { name: 'index', query: to.fullPath === '/' ? undefined : { redirect: to.fullPath } },
      { replace: true, redirectCode: 302 },
    );
  }
});
