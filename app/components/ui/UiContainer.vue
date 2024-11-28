<script setup lang="ts">
import type { PrimitiveProps } from 'radix-vue';
import { Primitive } from 'radix-vue';
import { tv, type VariantProps } from 'tailwind-variants';

/////////////
// Styling //
/////////////

const container = tv({
  base: 'w-full max-w-7xl mx-auto',
  variants: {
    padded: {
      true: 'px-4 sm:px-6 lg:px-8',
      false: '',
    },
  },
  defaultVariants: {
    padded: true,
  },
});

//////////////////////
// Type definitions //
//////////////////////

export type ContainerVariants = VariantProps<typeof container>;

interface ContainerProps extends PrimitiveProps {
  /** Disable the x-axis padding */
  noPadding?: boolean;
  /** Override element classes */
  class?: any;
}

///////////////////////
// Component options //
///////////////////////

defineProps<ContainerProps>();
</script>

<template>
  <Primitive :as="as" :as-child="asChild" :class="container({ padded: !noPadding, class: $props.class })">
    <slot />
  </Primitive>
</template>
