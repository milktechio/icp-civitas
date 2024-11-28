<script setup lang="ts">
import { tv } from 'tailwind-variants';
import type { AppNotification } from '~/stores/notifications';

const notification = tv({
  slots: {
    base: 'pointer-events-auto flex w-full max-w-sm items-start overflow-hidden rounded-lg border p-2 shadow-sm',
    icon: 'size-5 shrink-0',
    iconName: '',
  },
  variants: {
    mode: {
      success: {
        base: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        icon: 'text-emerald-600',
        iconName: 'i-heroicons-check-circle-20-solid',
      },
      info: {
        base: 'bg-blue-50 text-blue-600 border-blue-100',
        icon: 'text-blue-600',
        iconName: 'i-heroicons-information-circle-20-solid',
      },
      fail: {
        base: 'bg-red-50 text-red-600 border-red-100',
        icon: 'text-red-600',
        iconName: 'i-heroicons-x-circle-20-solid',
      },
    },
  },
  defaultVariants: {
    mode: 'info',
  },
});

const notifs = useNotifsStore();

const props = defineProps<{ info: AppNotification }>();

const ui = computed(() => notification({ mode: props.info.mode }));
</script>

<template>
  <div :class="ui.base()">
    <Icon :name="ui.iconName()" :class="ui.icon()" />

    <div class="ml-2 w-0 flex-1">
      <p class="text-sm font-semibold">{{ info.title }}</p>
      <p v-show="info.details" class="whitespace-pre-line text-sm opacity-90">
        {{ info.details }}
      </p>
    </div>

    <UiButton size="icon" variant="white-ghost" class="-my-1 -mr-1 ml-3" @click="notifs.dismiss(info.id)">
      <span class="sr-only">Descartar notificación</span>
      <Icon name="i-heroicons-x-mark-20-solid" :class="ui.icon()" />
    </UiButton>
  </div>
</template>
