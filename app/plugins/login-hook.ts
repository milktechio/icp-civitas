/**
 * Custom hook to let the pages know when user logged in
 */
export default defineNuxtPlugin({
  name: 'login-hook',
  enforce: 'pre',
  setup(nuxtApp) {
    nuxtApp.hooks.addHooks('auth:logged-in');
  },
});
