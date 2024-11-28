<script setup lang="ts">
import type { SharedPoll } from '#decs/backend/backend.did';

const auth = useAuthStore();
const notifs = useNotifsStore();
const votingStore = useVotingStore();

const props = defineProps<{ poll: SharedPoll }>();

const isSubmitting = ref(false);

async function submitVote(optionId: bigint) {
  isSubmitting.value = true;
  await votingStore.registerVote(props.poll.id, optionId, auth.principalId!);
  isSubmitting.value = false;

  notifs.notify('Your vote has been registered!', { mode: 'success' });
}
</script>

<template>
  <li class="rounded-lg bg-white p-4 shadow-card-sm">
    <div class="flex items-start justify-between gap-4">
      <h2 class="font-semibold text-gray-950">{{ poll.name }}</h2>

      <span v-if="poll.votes.includes(1n)" class="block text-sm text-gray-700">
        Your vote: <strong>{{ poll.options[poll.votes.indexOf(1n)]?.name }}</strong>
      </span>
    </div>

    <div v-if="!poll.votes.includes(1n)" class="mt-1">
      <span class="text-xs font-medium text-gray-700">{{
        isSubmitting ? 'Submitting vote...' : 'Cast your vote!'
      }}</span>

      <div
        :data-submitting="isSubmitting ? '' : undefined"
        class="mt-1 flex flex-wrap gap-3 data-[submitting]:animate-pulse"
      >
        <UiButton
          v-for="(option, optionIdx) in poll.options"
          :key="optionIdx"
          :label="option.name"
          :disabled="isSubmitting"
          size="xs"
          variant="brand-soft"
          @click="() => submitVote(option.id)"
        />
      </div>
    </div>

    <div v-else class="mt-1">
      <span class="block text-xs font-medium text-gray-700"
        >Options:
        {{
          formatList(
            poll.options.map((option) => `${option.name}`),
            { type: 'disjunction' },
          )
        }}</span
      >
    </div>
  </li>
</template>
