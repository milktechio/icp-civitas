<script setup lang="ts"></script>

<template>
  <div>
    <Body class="antialiased selection:bg-brand-50/90 selection:text-brand-700" />

    <NuxtLoadingIndicator color="#166534" />

    <TheNotificationsPanel />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
