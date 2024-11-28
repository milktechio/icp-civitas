<script setup lang="ts">
import { Primitive, type PrimitiveProps } from 'radix-vue';
import { tv } from 'tailwind-variants';

/////////////
// Styling //
/////////////

const formFieldContainer = tv({
  base: 'group/formfield flex flex-col gap-y-1 data-[disabled-mode=disabled]:opacity-70',
});

//////////////////////
// Type definitions //
//////////////////////

export interface FormFieldContainerProps extends Omit<PrimitiveProps, 'asChild'> {
  /** Field label */
  label?: string;
  /** Set error state */
  error?: boolean;
  /** Describe the field or show a useful hint */
  hint?: string;
  /** Disable the input */
  disabled?: boolean;
  /** Don't allow input, but show as enabled visually */
  readOnly?: boolean;
  /** Show mandatory indicator */
  mandatory?: boolean;
  /** Show help text as a tooltip */
  helpText?: string;
  /** HTML class */
  class?: any;
}

///////////////////////
// Component options //
///////////////////////

const _id = useId();

const props = defineProps<FormFieldContainerProps>();

const dataAttrs = computed(() => ({
  'data-error': props.error ? '' : undefined,
  'data-disabled-mode': props.readOnly ? 'read-only' : props.disabled ? 'disabled' : undefined,
}));
</script>

<template>
  <Primitive v-bind="dataAttrs" :as="props.as" :class="formFieldContainer({ class: props.class })">
    <slot name="label">
      <FormFieldLabel v-if="label" :for="_id" :error="error" :mandatory="mandatory" :help-text="helpText">{{
        label
      }}</FormFieldLabel>
    </slot>

    <slot :id="_id" :aria-describedby="props.hint ? `${_id}:hint` : undefined" />

    <slot name="hint">
      <div v-if="error || hint" class="flex gap-2">
        <Icon
          v-if="error"
          name="i-heroicons-exclamation-circle"
          class="mt-0.5 size-4 shrink-0 text-red-700"
        />

        <p
          v-if="hint"
          :id="`${_id}:hint`"
          class="text-sm text-gray-500 group-data-[error]/formfield:text-red-700"
        >
          {{ hint }}
        </p>
      </div>
    </slot>
  </Primitive>
</template>
