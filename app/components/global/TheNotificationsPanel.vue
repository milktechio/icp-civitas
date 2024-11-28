<script setup lang="ts">
const notifs = useNotifsStore();
</script>

<template>
  <Teleport to="#teleports">
    <div
      class="pointer-events-none fixed inset-0 z-[51] flex items-end overflow-hidden px-4 pb-20 pt-6 sm:p-6"
    >
      <TransitionGroup
        tag="div"
        name="notifs"
        class="relative flex w-full flex-col items-center justify-end gap-y-2 sm:items-end sm:justify-end"
      >
        <UiToastNotification
          v-for="notification in notifs.notifications"
          :key="notification.id"
          :info="notification"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style>
.notifs-move,
.notifs-enter-active,
.notifs-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

.notifs-enter-from,
.notifs-leave-to {
  @apply translate-y-2 opacity-0;
}

.notifs-leave-active {
  position: absolute;
}
</style>
