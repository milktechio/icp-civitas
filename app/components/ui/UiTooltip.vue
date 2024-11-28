<script setup lang="ts">
import {
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  useForwardPropsEmits,
  type TooltipContentProps,
  type TooltipRootEmits,
  type TooltipRootProps,
} from 'radix-vue';

//////////////////////
// Type definitions //
//////////////////////

interface Props extends Omit<TooltipRootProps, 'delayDuration'> {
  content?: string;
  delay?: string | number;
  offset?: string | number;
  collisionBoundary?: any;
  align?: TooltipContentProps['align'];
  side?: TooltipContentProps['side'];
}

///////////////////////
// Component options //
///////////////////////

const props = withDefaults(defineProps<Props>(), { collisionBoundary: undefined, delay: 0, offset: 8 });
const emits = defineEmits<TooltipRootEmits>();

const rootFwd = useForwardPropsEmits(
  reactivePick(
    props,
    'defaultOpen',
    'disableClosingTrigger',
    'disabled',
    'disableHoverableContent',
    'ignoreNonKeyboardFocus',
    'open',
  ),
  emits,
);

/** Convert offset to number. This allows passing a numeric string */
const numericOffset = useToNumber(props.offset);
/** Convert delay to number. This allows passing a numeric string */
const numericDelay = useToNumber(props.delay);
</script>

<template>
  <TooltipProvider>
    <TooltipRoot v-bind="rootFwd" :delay-duration="numericDelay">
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>

      <TooltipPortal v-if="!disabled" to="#teleports">
        <TooltipContent
          as-child
          :side="side"
          :align="align"
          :side-offset="numericOffset"
          :collision-boundary="collisionBoundary"
        >
          <slot name="content">
            <div class="app-tooltip__content">
              {{ content }}
            </div>
          </slot>
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>

<style>
.app-tooltip__content {
  @apply isolate z-50 max-w-xs whitespace-pre-line rounded bg-gray-800 px-2 py-1 text-xs font-normal text-white shadow ring-1 ring-white/40;

  animation-duration: 300ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
}

.app-tooltip__content[data-state='delayed-open'][data-side='top'] {
  animation-name: app-tooltip-slide-down;
}
.app-tooltip__content[data-state='delayed-open'][data-side='right'] {
  animation-name: app-tooltip-slide-left;
}
.app-tooltip__content[data-state='delayed-open'][data-side='bottom'] {
  animation-name: app-tooltip-slide-up;
}
.app-tooltip__content[data-state='delayed-open'][data-side='left'] {
  animation-name: app-tooltip-slide-right;
}

@keyframes app-tooltip-slide-up {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes app-tooltip-slide-right {
  from {
    opacity: 0;
    transform: translateX(-6px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes app-tooltip-slide-down {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes app-tooltip-slide-left {
  from {
    opacity: 0;
    transform: translateX(6px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
