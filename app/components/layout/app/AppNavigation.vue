<script setup lang="ts">
const auth = useAuthStore();

const loggingOut = ref(false);

async function handleLogOut() {
  loggingOut.value = true;
  await auth.logout();
  loggingOut.value = false;

  navigateTo('/', { replace: true });
}
</script>

<template>
  <header class="z-30 w-full bg-white shadow-card-sm">
    <UiContainer class="flex items-center justify-between py-3">
      <div class="flex">
        <img src="/_brand/logo.svg" alt="Logo Civitas" class="h-8" />
      </div>

      <nav class="flex items-center gap-4">
        <UiButton
          exact
          label="Home"
          active-variant="gray-soft"
          inactive-variant="gray-ghost"
          left-icon="i-heroicons-home-20-solid"
          to="/polls"
        />

        <UiButton
          label="New poll"
          active-variant="gray-soft"
          inactive-variant="gray-ghost"
          left-icon="i-heroicons-plus-20-solid"
          to="/polls/new"
        />

        <UiButton
          label="Log out"
          variant="danger-ghost"
          left-icon="i-heroicons-arrow-left-start-on-rectangle-20-solid"
          :loading="loggingOut"
          @click="handleLogOut"
        />
      </nav>
    </UiContainer>
  </header>
</template>
