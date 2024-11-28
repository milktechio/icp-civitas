import type { SharedPoll } from '#decs/backend/backend.did';
import { acceptHMRUpdate, defineStore } from 'pinia';

export const useVotingStore = defineStore('voting', {
  state: () => ({
    polls: [] as SharedPoll[],
    isLoadingPolls: false,
  }),

  actions: {
    async createPoll(pollName: string, options: string[]) {
      try {
        const response = await useBackend().createPoll(pollName, options);
        this.polls.unshift(response);
      } catch (error) {
        console.error('(createPoll):', error);
      }
    },

    async getPolls() {
      this.isLoadingPolls = true;

      try {
        const response = await useBackend().getPolls();
        this.polls = response.elems;
      } catch (error) {
        console.error('(createPoll):', error);
      }

      this.isLoadingPolls = false;
    },

    async registerVote(pollId: bigint, optionId: bigint, voterId: string) {
      try {
        await useBackend().addVoteToPoll(pollId, optionId, voterId);
        await this.getPolls();
      } catch (error) {
        console.error('(registerVote):', error);
      }
    },
  },
});

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useVotingStore, import.meta.hot));
