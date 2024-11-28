<script setup lang="ts">
definePageMeta({ middleware: 'only-auth', layout: 'app' });

const votingStore = useVotingStore();

////////////////////////
// Fetch initial data //
////////////////////////

const { status } = await useLazyAsyncData('page:polls', async () => {
  await votingStore.getPolls();
});
</script>

<template>
  <div>
    <UiContainer>
      <h1 class="text-3xl font-semibold text-gray-700">All polls</h1>

      <MiscLoadingState v-if="status === 'pending'" class="mt-5" />

      <ul v-else-if="votingStore.polls.length" class="mt-5 space-y-6">
        <PollCard v-for="(poll, pollIdx) in votingStore.polls" :key="pollIdx" :poll="poll" />
      </ul>

      <MiscEmptyState
        v-else
        class="mt-5"
        title="No polls here"
        description="It seems as if no polls have been created yet"
      />
    </UiContainer>
  </div>
</template>
