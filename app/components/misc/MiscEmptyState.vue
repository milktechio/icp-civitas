<script setup lang="ts">
defineProps<{ title?: string; description?: string }>();
</script>

<template>
  <UiContainer class="rounded-2xl border border-dashed border-gray-950/15">
    <div class="mx-auto flex max-w-lg flex-col items-center justify-center py-10">
      <span class="text-center text-xl font-semibold text-gray-700">
        <slot name="title">{{ title }}</slot>
      </span>

      <span class="mt-1 text-center text-sm text-gray-500">
        <slot name="description">{{ description }}</slot>
      </span>
    </div>
  </UiContainer>
</template>
