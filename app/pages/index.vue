<script setup lang="ts">
definePageMeta({
  /** If user is logged in, redirect to dashboard */
  middleware: () => {
    const _a = useAuthStore();
    if (_a.isLoggedIn) return navigateTo('/polls', { replace: true, redirectCode: 302 });
  },
});

const app = useNuxtApp();
const route = useRoute();
const auth = useAuthStore();

const loading = ref(false);

async function handleLogIn() {
  loading.value = true;
  await auth.login();
  loading.value = false;
}

/** Listen to auth hook to navigate away */
app.hooks.hookOnce('auth:logged-in', () => {
  // Allow going to the route they requested while logged out
  navigateTo(route.query.redirect?.toString() ?? '/polls', { replace: true });
});
</script>

<template>
  <div class="mesh-bg relative z-0 flex h-screen items-center justify-center bg-gray-50">
    <svg aria-hidden="true" class="sr-only" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="8" result="turbulence" />
      </filter>

      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>

    <div
      class="flex w-full max-w-md flex-col items-center rounded-xl border-gray-900/10 bg-white p-8 shadow-2xl"
    >
      <img src="/_brand/logo.svg" alt="Logo Civitas" class="h-12" />
      <h1 class="mt-4 text-center text-3xl font-semibold text-gray-700 sm:text-4xl">Welcome</h1>
      <span class="text-center text-gray-700">Please log in to access Civitas.</span>

      <UiButton
        class="mt-8 w-full"
        variant="brand-solid"
        label="Log in with Internet Identity"
        :loading="loading"
        @click="handleLogIn"
      />
    </div>
  </div>
</template>

<style scoped>
.mesh-bg::before,
.mesh-bg::after {
  position: absolute;
  inset: 0;
  content: '';
  width: 100%;
  height: 100%;
  z-index: -1;
  mix-blend-mode: multiply;
}

.mesh-bg::before {
  filter: url(#noiseFilter);
}

.mesh-bg::after {
  background-image: url(/_decor/mesh-549.webp);
  background-size: cover;
  background-position: center center;
  filter: brightness(120%);
}
</style>
