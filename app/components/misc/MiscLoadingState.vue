<script setup lang="ts">
import { tv, type VariantProps } from 'tailwind-variants';

/////////////
// Styling //
/////////////

const loader = tv({
  slots: {
    container: 'flex flex-col items-center justify-center',
    icon: 'animate-spin text-brand-600',
    label: 'text-center text-xs text-gray-600',
  },
  variants: {
    size: {
      xs: {
        container: 'p-2',
        icon: 'size-4',
      },
      lg: {
        container: 'px-2 py-10',
        icon: 'size-6',
        label: 'max-w-[15rem]',
      },
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});

//////////////////////
// Type definitions //
//////////////////////

export type LoaderVariants = VariantProps<typeof loader>;

interface Props {
  /** Loading label */
  label?: string;
  /** Size variant. @default 'lg' */
  size?: LoaderVariants['size'];
  /** Override container classes */
  class?: any;
}

const props = withDefaults(defineProps<Props>(), { label: 'Cargando...', size: 'lg' });

const ui = computed(() => loader({ size: props.size }));
</script>

<template>
  <div :class="ui.container({ class: props.class })">
    <div><Icon name="i-ph-circle-notch-bold" :class="ui.icon()" /></div>
    <span :class="ui.label()">{{ label }}</span>
  </div>
</template>
