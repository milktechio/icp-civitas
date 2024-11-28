import { fileURLToPath } from 'url';

export default defineNuxtConfig({
  ssr: false,

  future: {
    compatibilityVersion: 4,
  },

  devtools: { enabled: true },
  compatibilityDate: '2024-11-06',
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
    '@nuxt/fonts',
  ],

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],

      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' }],
    },
  },

  runtimeConfig: {
    public: {
      canisterId: process.env.CANISTER_ID_BACKEND,
    },
  },

  // Required to run canister in development
  vite: {
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
    },
  },

  components: [{ path: '~/components', pathPrefix: false }],

  icon: { clientBundle: { scan: true } },

  tailwindcss: { viewer: false },

  typescript: { strict: true, shim: false },

  fonts: {
    families: [{ name: 'Inter', src: '/_font/InterVariable.woff2', weight: '300 900' }],
  },

  alias: {
    '#decs': fileURLToPath(new URL('./declarations', import.meta.url)),
  },
});
