<script setup lang="ts">
definePageMeta({ middleware: 'only-auth', layout: 'app' });

const auth = useAuthStore();
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
        <li
          v-for="(poll, pollIdx) in votingStore.polls"
          :key="pollIdx"
          class="rounded-lg bg-white p-4 shadow-card-sm"
        >
          <div class="flex items-start justify-between gap-4">
            <h2 class="font-semibold text-gray-950">{{ poll.name }}</h2>

            <span v-if="poll.votes.includes(1n)" class="block text-sm text-gray-700">
              Your vote: <strong>{{ poll.options[poll.votes.indexOf(1n)]?.name }}</strong>
            </span>
          </div>

          <div v-if="!poll.votes.includes(1n)" class="mt-1">
            <span class="text-xs font-medium text-gray-700">Cast your vote!</span>

            <div class="mt-1 flex flex-wrap gap-3">
              <UiButton
                v-for="(option, optionIdx) in poll.options"
                :key="`${pollIdx}:${optionIdx}`"
                :label="option.name"
                size="xs"
                variant="brand-soft"
                @click="() => votingStore.registerVote(poll.id, option.id, auth.principalId!)"
              />
            </div>
          </div>

          <div v-else class="mt-1">
            <span class="block text-xs font-medium text-gray-700"
              >Options:
              {{
                formatList(
                  poll.options.map((option, optionIdx) => `${option.name}`),
                  { type: 'disjunction' },
                )
              }}</span
            >
          </div>
        </li>
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
