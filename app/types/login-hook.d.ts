import 'nuxt/app';

declare module 'nuxt/app' {
  export interface RuntimeNuxtHooks {
    'auth:logged-in': () => void;
  }
}
