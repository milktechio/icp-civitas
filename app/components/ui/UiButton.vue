<script setup lang="ts">
import type { NuxtLinkProps } from '#app';
import type { VariantProps } from 'tailwind-variants';
import type { UseLinkStateOptions } from '~/composables/links';

import { NuxtLink } from '#components';
import { Primitive, useForwardProps } from 'radix-vue';
import { tv } from 'tailwind-variants';

/////////////
// Styling //
/////////////

const button = tv({
  slots: {
    base: 'inline-flex shrink-0 select-none items-center justify-center font-semibold focus:outline-none',
    icons: 'shrink-0',
    leftIcon: '',
    rightIcon: '',
  },
  variants: {
    variant: {
      'white-solid': 'app-btn app-btn__white-solid focus-visible:outline-2 focus-visible:outline-brand-600',
      'white-soft':
        'app-btn app-btn__white-soft focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand-600',
      'white-ghost':
        'app-btn app-btn__white-ghost focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand-600',
      'white-link': 'text-white',

      'gray-solid': 'app-btn app-btn__gray-solid focus-visible:outline-2 focus-visible:outline-gray-600',
      'gray-soft':
        'app-btn app-btn__gray-soft focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gray-600',
      'gray-ghost':
        'app-btn app-btn__gray-ghost focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gray-600',
      'gray-link': 'text-gray-900',

      'brand-solid': 'app-btn app-btn__brand-solid focus-visible:outline-2 focus-visible:outline-brand-600',
      'brand-soft':
        'app-btn app-btn__brand-soft focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand-600',
      'brand-ghost':
        'app-btn app-btn__brand-ghost focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand-600',
      'brand-link': 'text-brand-600',

      'danger-solid': 'app-btn app-btn__danger-solid focus-visible:outline-2 focus-visible:outline-red-600',
      'danger-soft':
        'app-btn app-btn__danger-soft focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-red-600',
      'danger-ghost':
        'app-btn app-btn__danger-ghost focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-red-600',
      'danger-link': 'text-red-600',
    },

    size: {
      xs: {
        base: 'gap-x-1.5 rounded-md px-2 py-1 text-xs',
        icons: 'size-4',
        leftIcon: '-ml-1',
        rightIcon: '-mr-1',
      },
      sm: {
        base: 'gap-x-1 rounded-lg px-3 py-1.5 text-sm',
        icons: 'size-4',
        leftIcon: '-ml-1',
        rightIcon: '-mr-1',
      },
      md: {
        base: 'gap-x-2 rounded-lg px-5 py-2.5 text-sm',
        icons: 'size-5',
        leftIcon: '-ml-1.5',
        rightIcon: '-mr-1.5',
      },
      icon: {
        base: 'gap-x-1 rounded-md p-1',
        icons: 'size-5',
      },
      custom: { base: '', icons: '' },
    },

    disabled: {
      true: {
        base: 'cursor-not-allowed opacity-70',
      },
    },
  },

  compoundVariants: [
    {
      variant: ['white-link', 'gray-link', 'brand-link', 'danger-link'],
      class: {
        base: 'underline-offset-4',
      },
    },
    {
      variant: ['white-link', 'gray-link', 'brand-link', 'danger-link'],
      disabled: false,
      class: {
        base: 'hover:underline focus-visible:underline',
      },
    },
    {
      variant: ['gray-solid', 'brand-solid', 'white-solid', 'danger-solid'],
      class: {
        base: 'focus-visible:outline-offset-2',
      },
    },
  ],

  defaultVariants: {
    size: 'sm',
    disabled: false,
    variant: 'white-solid',
  },
});

//////////////////////
// Type definitions //
//////////////////////

export type ButtonVariants = VariantProps<typeof button>;

interface ButtonProps extends NuxtLinkProps, Omit<UseLinkStateOptions, 'isActive'> {
  /** The label of the button */
  label?: string;
  /** Icon to render on the left side */
  leftIcon?: string;
  /** Icon to render on the right side */
  rightIcon?: string;
  /** Set loading state */
  loading?: boolean;
  /** Disable the button and it's action */
  disabled?: boolean;
  /** HTML button type */
  type?: HTMLButtonElement['type'];
  /** Change the size of the button */
  size?: ButtonVariants['size'];
  /** Change the appearance of the button */
  variant?: ButtonVariants['variant'];
  /** Use this variant if link is inactive */
  inactiveVariant?: ButtonVariants['variant'];
  /** Use this variant if link is active */
  activeVariant?: ButtonVariants['variant'];
  /** Override active state */
  isActive?: boolean;
  /** Override element classes */
  class?: any;
}

///////////////////////
// Component options //
///////////////////////

const props = withDefaults(defineProps<ButtonProps>(), { type: 'button', isActive: undefined });

////////////////////////
// Base functionality //
////////////////////////

const linkProps = useForwardProps(
  reactivePick(props, 'custom', 'ariaCurrentValue', 'to', 'href', 'external', 'replace'),
);

const { isLinkActive } = useLinkState(linkProps, {
  isActive: toRef(props, 'isActive'),
  exact: props.exact,
  exactHash: props.exactHash,
  exactQuery: props.exactQuery,
  excludePaths: props.excludePaths,
  includePaths: props.includePaths,
});

const currentVariant = computed<ButtonVariants['variant']>(() => {
  if (props.variant !== undefined) return props.variant;
  return isLinkActive.value ? props.activeVariant : props.inactiveVariant;
});

/** To implement "disabled" on links, they will only be rendered as links if enabled */
const renderAsLink = computed(() => !props.disabled && !props.loading && (!!props.to || !!props.href));

const ui = computed(() =>
  button({
    size: props.size,
    variant: currentVariant.value,
    disabled: props.disabled || props.loading,
  }),
);

/** The right icon will be the loading icon if "loading" is true */
const rightIconName = computed(() => {
  if (props.loading) return 'i-heroicons-arrow-path-20-solid';
  return props.rightIcon;
});
</script>

<template>
  <Primitive
    v-bind="renderAsLink ? linkProps : undefined"
    :disabled="renderAsLink ? undefined : disabled || loading"
    :as="renderAsLink ? NuxtLink : 'button'"
    :type="renderAsLink ? undefined : type"
    :class="ui.base({ class: props.class })"
    :data-disabled="disabled || loading ? '' : undefined"
  >
    <slot name="left">
      <Icon v-if="leftIcon" :name="leftIcon" :class="[ui.icons(), ui.leftIcon()]" />
    </slot>

    <slot>
      <span v-if="label">{{ label }}</span>
    </slot>

    <slot name="right">
      <Icon
        v-if="rightIconName"
        :name="rightIconName"
        :class="[ui.icons({ class: [loading && 'animate-spin'] }), ui.rightIcon()]"
      />
    </slot>
  </Primitive>
</template>

<style>
/* CUSTOM BUTTONS */
.app-btn {
  --app-btn-decor-glare: linear-gradient(180deg, theme(colors.white/10%) 0%, transparent 50%);
  --app-btn-decor-rest-inset: 0px 0px 0px 0px theme(colors.black/10%) inset;
  --app-btn-decor-pressed-inset: 0px 2px 0px 1px theme(colors.black/10%) inset;
  --app-btn-decor-border-shine: 0px 1px 0px 0px theme(colors.white/10%) inset;

  --app-btn-easing: cubic-bezier(0.19, 0.91, 0.38, 1);
  --app-btn-bg: var(--app-btn-decor-glare), theme(colors.brand.600);
  --app-btn-text-color: white;
  --app-btn-shadow: var(--app-btn-decor-border-shine), 0px 0px 0px 1px theme(colors.brand.700/90%);
  --app-btn-text-hover-opacity: 0.7;

  color: var(--app-btn-text-color);
  background: var(--app-btn-bg);
  box-shadow: var(--app-btn-shadow);
  transition:
    color 75ms var(--app-btn-easing),
    background 75ms var(--app-btn-easing),
    box-shadow 75ms var(--app-btn-easing);
}

.app-btn > * {
  transition: transform 150ms var(--app-btn-easing);
}

.app-btn:not([data-disabled]):hover > * {
  opacity: var(--app-btn-text-hover-opacity);
}

.app-btn:not([data-disabled]):active > * {
  transform: translateY(1px);
  opacity: var(--app-btn-text-hover-opacity);
}

/* brand BUTTON */
.app-btn__brand-solid:not([data-disabled]):active {
  --app-btn-bg: theme(colors.brand.800);
  --app-btn-shadow: var(--app-btn-decor-pressed-inset), 0px 0px 0px 1px theme(colors.brand.700/90%);
}

/* brand SOFT BUTTON */
.app-btn__brand-soft {
  --app-btn-bg: theme(colors.brand.700/5%);
  --app-btn-text-color: theme(colors.brand.700);
  --app-btn-shadow: var(--app-btn-decor-rest-inset), 0px 0px 0px 1px var(--app-btn-bg);
  --app-btn-text-hover-opacity: 1;
}

.app-btn__brand-soft:not([data-disabled]):hover,
.app-btn__brand-ghost:not([data-disabled]):hover {
  --app-btn-bg: theme(colors.brand.700/10%);
}

.app-btn__brand-soft:not([data-disabled]):active,
.app-btn__brand-ghost:not([data-disabled]):active {
  --app-btn-bg: theme(colors.brand.700/15%);
  --app-btn-shadow: var(--app-btn-decor-pressed-inset), 0px 0px 0px 1px var(--app-btn-bg);
}

/* brand GHOST BUTTON. SHARES HOVER-ACTIVE WITH SOFT */
.app-btn__brand-ghost {
  --app-btn-bg: transparent;
  --app-btn-text-color: theme(colors.brand.700);
  --app-btn-shadow: var(--app-btn-decor-rest-inset), 0px 0px 0px 1px var(--app-btn-bg);
  --app-btn-text-hover-opacity: 1;
}

/* SOLID WHITE BUTTON */
.app-btn__white-solid {
  --app-btn-bg: white;
  --app-btn-text-color: theme(colors.gray.700);
  --app-btn-shadow: var(--app-btn-decor-rest-inset), theme(boxShadow.card-sm);
  --app-btn-text-hover-opacity: 0.8;
}

.app-btn__white-solid:not([data-disabled]):hover {
  --app-btn-bg: theme(colors.gray.50);
}

.app-btn__white-solid:not([data-disabled]):active {
  --app-btn-bg: theme(colors.gray.50);
  --app-btn-shadow: var(--app-btn-decor-pressed-inset), theme(boxShadow.card-sm);
}

/* WHITE SOFT BUTTON */
.app-btn__white-soft {
  --app-btn-bg: theme(colors.white/5%);
  --app-btn-text-color: theme(colors.white);
  --app-btn-shadow: var(--app-btn-decor-rest-inset), 0px 0px 0px 1px var(--app-btn-bg);
  --app-btn-text-hover-opacity: 1;
}

.app-btn__white-soft:not([data-disabled]):hover,
.app-btn__white-ghost:not([data-disabled]):hover {
  --app-btn-bg: theme(colors.white/10%);
}

.app-btn__white-soft:not([data-disabled]):active,
.app-btn__white-ghost:not([data-disabled]):active {
  --app-btn-bg: theme(colors.white/15%);
  --app-btn-shadow: var(--app-btn-decor-pressed-inset), 0px 0px 0px 1px var(--app-btn-bg);
}

/* WHITE GHOST BUTTON. SHARES HOVER-ACTIVE WITH SOFT */
.app-btn__white-ghost {
  --app-btn-bg: transparent;
  --app-btn-text-color: theme(colors.white);
  --app-btn-shadow: var(--app-btn-decor-rest-inset), 0px 0px 0px 1px var(--app-btn-bg);
  --app-btn-text-hover-opacity: 1;
}

/* GRAY BUTTON */
.app-btn__gray-solid {
  --app-btn-bg: var(--app-btn-decor-glare), theme(colors.gray.600);
  --app-btn-shadow: var(--app-btn-decor-border-shine), 0px 0px 0px 1px theme(colors.gray.700/90%);
}

.app-btn__gray-solid:not([data-disabled]):hover {
  --app-btn-bg: var(--app-btn-decor-glare), theme(colors.gray.700);
}

.app-btn__gray-solid:not([data-disabled]):active {
  --app-btn-bg: theme(colors.gray.800);
  --app-btn-shadow: var(--app-btn-decor-pressed-inset), 0px 0px 0px 1px theme(colors.gray.700/90%);
}

/* GRAY SOFT BUTTON */
.app-btn__gray-soft {
  --app-btn-bg: theme(colors.gray.900/5%);
  --app-btn-text-color: theme(colors.gray.700);
  --app-btn-shadow: var(--app-btn-decor-rest-inset), 0px 0px 0px 1px var(--app-btn-bg);
  --app-btn-text-hover-opacity: 1;
}

.app-btn__gray-soft:not([data-disabled]):hover,
.app-btn__gray-ghost:not([data-disabled]):hover {
  --app-btn-bg: theme(colors.gray.900/10%);
}

.app-btn__gray-soft:not([data-disabled]):active,
.app-btn__gray-ghost:not([data-disabled]):active {
  --app-btn-bg: theme(colors.gray.900/15%);
  --app-btn-shadow: var(--app-btn-decor-pressed-inset), 0px 0px 0px 1px var(--app-btn-bg);
}

/* GRAY GHOST BUTTON. SHARES HOVER-ACTIVE WITH SOFT */
.app-btn__gray-ghost {
  --app-btn-bg: transparent;
  --app-btn-text-color: theme(colors.gray.700);
  --app-btn-shadow: var(--app-btn-decor-rest-inset), 0px 0px 0px 1px var(--app-btn-bg);
  --app-btn-text-hover-opacity: 1;
}

/* DANGER BUTTON */
.app-btn__danger-solid {
  --app-btn-bg: var(--app-btn-decor-glare), theme(colors.red.700);
  --app-btn-shadow: var(--app-btn-decor-border-shine), 0px 0px 0px 1px theme(colors.red.800/90%);
}

.app-btn__danger-solid:not([data-disabled]):hover {
  --app-btn-bg: var(--app-btn-decor-glare), theme(colors.red.800);
}

.app-btn__danger-solid:not([data-disabled]):active {
  --app-btn-bg: theme(colors.red.900);
  --app-btn-shadow: var(--app-btn-decor-pressed-inset), 0px 0px 0px 1px theme(colors.red.800/90%);
}

/* DANGER SOFT BUTTON */
.app-btn__danger-soft {
  --app-btn-bg: theme(colors.red.700/5%);
  --app-btn-text-color: theme(colors.red.700);
  --app-btn-shadow: var(--app-btn-decor-rest-inset), 0px 0px 0px 1px var(--app-btn-bg);
  --app-btn-text-hover-opacity: 1;
}

.app-btn__danger-soft:not([data-disabled]):hover,
.app-btn__danger-ghost:not([data-disabled]):hover {
  --app-btn-bg: theme(colors.red.700/10%);
}

.app-btn__danger-soft:not([data-disabled]):active,
.app-btn__danger-ghost:not([data-disabled]):active {
  --app-btn-bg: theme(colors.red.700/15%);
  --app-btn-shadow: var(--app-btn-decor-pressed-inset), 0px 0px 0px 1px var(--app-btn-bg);
}

/* DANGER GHOST BUTTON. SHARES HOVER-ACTIVE WITH SOFT */
.app-btn__danger-ghost {
  --app-btn-bg: transparent;
  --app-btn-text-color: theme(colors.red.700);
  --app-btn-shadow: var(--app-btn-decor-rest-inset), 0px 0px 0px 1px var(--app-btn-bg);
  --app-btn-text-hover-opacity: 1;
}
</style>
