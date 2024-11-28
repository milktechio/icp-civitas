<script setup lang="ts">
import { Label, type LabelProps } from 'radix-vue';

//////////////////////
// Type definitions //
//////////////////////

interface Props extends Omit<LabelProps, 'asChild'> {
  mandatory?: boolean;
  error?: boolean;
  helpText?: string;
}

///////////////////////
// Component options //
///////////////////////

const props = defineProps<Props>();
</script>

<template>
  <span class="flex items-start">
    <Label
      :as="props.as"
      :for="props.for"
      :data-error="props.error ? '' : undefined"
      class="app-form-label peer"
    >
      <slot />
    </Label>

    <span v-if="props.mandatory" class="pointer-events-none ml-0.5 text-xs text-red-600">*</span>

    <UiTooltip v-if="props.helpText" :content="props.helpText">
      <div tabindex="0" class="app-form-label__tooltip">
        <span class="sr-only">Ayuda para este campo</span>
        <Icon name="i-heroicons-question-mark-circle-16-solid" class="size-4" />
      </div>
    </UiTooltip>
  </span>
</template>

<style>
.app-form-label {
  @apply text-sm font-medium text-gray-700 data-[error]:text-red-800;
}

.app-form-label__tooltip {
  @apply ml-2 mt-0.5 flex shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:rounded focus-visible:text-gray-600 focus-visible:outline-brand-600 peer-data-[error]:text-red-600 peer-data-[error]:hover:text-red-700 peer-data-[error]:focus-visible:text-red-700 peer-data-[error]:focus-visible:outline-red-600;
}
</style>
