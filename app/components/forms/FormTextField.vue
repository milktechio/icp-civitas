<script setup lang="ts">
import { useForwardProps } from 'radix-vue';
import type { InputHTMLAttributes } from 'vue';
import type { FormFieldContainerProps } from './FormFieldContainer.vue';

//////////////////////
// Type definitions //
//////////////////////

interface Props extends FormFieldContainerProps {
  /** HTML input name */
  name?: string;
  /** Prefix icon */
  leftIcon?: string;
  /** Prefix text */
  leftText?: string;
  /** Suffix icon */
  rightIcon?: string;
  /** Suffix text */
  rightText?: string;
  /** HTML input placeholder */
  placeholder?: string;
  /** HTML input type */
  type?: InputHTMLAttributes['type'];
  /** Controlled input value */
  modelValue?: string | number;
}

///////////////////////
// Component options //
///////////////////////

defineOptions({ inheritAttrs: false });

const props = defineProps<Props>();
defineEmits<{ (e: 'update:modelValue', value: string | number): void }>();

const $value = defineModel<string | number>({ type: [String, Number] });

const fieldProps: any = useForwardProps(
  reactivePick(
    props,
    'label',
    'error',
    'hint',
    'disabled',
    'readOnly',
    'mandatory',
    'as',
    'helpText',
    'class',
  ),
);
</script>

<template>
  <FormFieldContainer v-slot="{ id, ariaDescribedby }" v-bind="fieldProps">
    <div class="app-form-text-field__container">
      <slot name="connect-left" />

      <div class="app-form-text-field__base">
        <slot name="prefix">
          <span v-if="props.leftText" class="app-form-text-field__addons ml-3">{{ props.leftText }}</span>
          <Icon v-else-if="props.leftIcon" :name="props.leftIcon" class="app-form-text-field__icons ml-3" />
        </slot>

        <input
          :id="id"
          v-model="$value"
          v-bind="$attrs"
          :name="props.name"
          :type="props.type"
          :placeholder="props.placeholder"
          :aria-describedby="ariaDescribedby"
          :disabled="props.disabled || props.readOnly"
          class="app-form-text-field__input"
        />

        <slot name="suffix">
          <span v-if="props.rightText" class="app-form-text-field__addons mr-3">{{ props.rightText }}</span>
          <Icon v-else-if="props.rightIcon" :name="props.rightIcon" class="app-form-text-field__icons mr-3" />
        </slot>
      </div>

      <slot name="connect-right" />
    </div>
  </FormFieldContainer>
</template>

<style>
.app-form-text-field__container {
  @apply flex w-full items-center gap-2;
}

.app-form-text-field__base {
  @apply flex w-full items-center rounded-lg bg-white ring-1 ring-gray-900/[8%] focus-within:ring-2 focus-within:ring-brand-500 group-data-[error]/formfield:bg-red-50 group-data-[error]/formfield:ring-red-800;
}

.app-form-text-field__addons {
  @apply select-none text-sm text-gray-500 peer-focus:text-brand-600 group-data-[error]/formfield:text-red-600;
}

.app-form-text-field__icons {
  @apply size-4 text-gray-600 peer-focus:text-brand-600 group-data-[error]/formfield:text-red-600 group-data-[error]/formfield:peer-focus:text-red-600;
}

.app-form-text-field__input {
  @apply block w-full flex-1 border-0 bg-transparent px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-0 group-data-[disabled-mode=disabled]/formfield:cursor-not-allowed group-data-[error]/formfield:text-red-800 group-data-[error]/formfield:selection:bg-red-500/15 group-data-[error]/formfield:selection:text-red-900 group-data-[error]/formfield:placeholder:text-red-500;
}
</style>
