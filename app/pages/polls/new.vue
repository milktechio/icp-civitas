<script setup lang="ts">
import { z } from 'zod';

definePageMeta({ middleware: 'only-auth', layout: 'app' });

const notifs = useNotifsStore();
const votingStore = useVotingStore();

const PollSchema = z.object({
  name: z.coerce.string().min(1, 'The name is required'),
  options: z
    .array(z.coerce.string().min(1, 'The option is required'))
    .min(2, 'There must be at least 2 options'),
});

type PollFields = z.infer<typeof PollSchema>;

const state = ref<PollFields>({
  name: '',
  options: ['', ''],
});

const isSubmitting = ref(false);
const { validate, errors } = useForm(PollSchema);

async function submitInfo() {
  if (isSubmitting.value) return;

  const isDataValid = validate(state.value);
  if (!isDataValid) return;

  isSubmitting.value = true;

  try {
    await votingStore.createPoll(state.value.name, state.value.options);

    notifs.notify('Poll successfully created', { mode: 'success' });
    navigateTo('/polls', { replace: true });
  } catch (error) {
    notifs.notify('Something went wrong', {
      mode: 'info',
      details: "We couldn't create the poll. Please try again later",
    });
  }

  isSubmitting.value = false;
}
</script>

<template>
  <div>
    <UiContainer>
      <h1 class="text-3xl font-semibold text-gray-700">Create new poll</h1>

      <form novalidate autocomplete="off" class="mt-5" @submit.prevent="submitInfo">
        <fieldset :disabled="isSubmitting">
          <FormTextField
            v-model="state.name"
            label="Poll name"
            placeholder="Choose a name for the poll"
            :error="!!errors?.name"
            :hint="errors?.name?._errors[0]"
          />

          <ul class="mt-4 flex w-full flex-col gap-y-2">
            <div class="flex items-center justify-between gap-4">
              <FormFieldLabel>Options</FormFieldLabel>

              <UiButton
                size="xs"
                label="Add option"
                left-icon="i-heroicons-plus-16-solid"
                @click="() => state.options.push('')"
              />
            </div>

            <li
              v-for="(option, optionIndex) in state.options"
              :key="optionIndex"
              class="flex items-start gap-4"
            >
              <FormTextField
                v-model="state.options[optionIndex]"
                class="flex-1"
                placeholder="Option"
                :error="!!errors?.options?.[optionIndex]"
                :hint="errors?.options?.[optionIndex]?._errors[0]"
              />

              <UiButton
                v-show="state.options.length > 1"
                size="icon"
                class="-mx-1 mt-0.5"
                variant="gray-ghost"
                @click="() => state.options.splice(optionIndex, 1)"
              >
                <span class="sr-only">Remove option</span>
                <Icon name="i-heroicons-trash-20-solid" class="size-5" />
              </UiButton>
            </li>
          </ul>
        </fieldset>

        <UiButton type="submit" label="Submit" variant="brand-solid" class="mt-3" :loading="isSubmitting" />
      </form>
    </UiContainer>
  </div>
</template>
