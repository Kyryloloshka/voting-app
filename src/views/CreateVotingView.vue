<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useVotingStore } from '@/store/useVotingStore';

const votingStore = useVotingStore();
const router = useRouter();

const options = ref<string[]>(['']);
const question = ref<string>('');
const multiChoice = ref<boolean>(false);

const errors = ref<{
  options: string;
  question: string;
}>({
  options: '',
  question: '',
});

const clearErrors = () => {
  for (const key of Object.keys(errors.value)) {
    errors.value[key as keyof typeof errors.value] = '';
  }
};

const handleInputOptionChange = () => {
  clearErrors();
  if (options.value[options.value.length - 1] !== '') {
    options.value.push('');
  }

  const shouldRemoveLastInput = () => {
    const lastTwoOptionsAreEmpty = options.value[options.value.length - 1] === '' && options.value[options.value.length - 2] === '';
    const optionsLengthBiggerThenOne = options.value.length > 1;

    return lastTwoOptionsAreEmpty && optionsLengthBiggerThenOne;
  };

  while (shouldRemoveLastInput()) {
    options.value.pop();
  }
};

const validateForm = (arrayToValidate: string[]) => {
  let isValid = true;
  clearErrors();
  if (question.value.length < 2) {
    errors.value.question = 'Question is too short :(';
    isValid = false;
  }
  if (arrayToValidate.length < 2) {
    errors.value.options = 'Provide at least two valid options';
    isValid = false;
  }
  return isValid;
};

const onSubmit = () => {
  const arrayToValidate = [...options.value.filter((option) => option !== '')];

  if (!validateForm(arrayToValidate)) return;

  options.value = arrayToValidate;
  votingStore.addVoting({
    id: `vote-${Date.now()}`,
    question: question.value,
    options: options.value,
    multiChoice: multiChoice.value,
    user: votingStore.user,
    showResults: true,
    createDate: new Date().toISOString(),
    usersVotes: [],
  });
  router.push('/all-votes');
};
</script>

<template>
  <main class="container pt-12">
    <div class="flex items-center flex-col gap-3 text-center">
      <h2 class="text-2xl font-medium mb-3">Create Voting</h2>
      <form class="space-y-6 flex flex-col" @submit.prevent="onSubmit">
        <div class="flex flex-col items-center">
          <Label class="text-light-500 mb-2">Type your question</Label>
          <Input class="max-w-[360px]" type="text" placeholder="question" v-model="question" />
          <div v-if="errors.question" class="text-red-500">{{ errors.question }}</div>
        </div>
        <div class="flex flex-col items-center">
          <Label class="text-light-500 mb-2">Select options</Label>
          <div class="space-y-3 w-full">
            <div v-for="(_, index) of options" :key="index" class="flex gap-3 items-center">
              <Input
                v-model="options[index]"
                type="text"
                :placeholder="`option ${index+1}`"
                class="max-w-[360px]"
                @input="handleInputOptionChange()"
              />
            </div>
          </div>
          <div v-if="errors.options" class="text-red-500">{{ errors.options }}</div>
        </div>
        <Label class="flex flex-nowrap items-center gap-3">
          <checkbox
            @update:checked="(checked) => multiChoice = checked"
            :checked="multiChoice"
          />
          <span>
            Multi choice
          </span>
        </Label>
        <Button class="min-w-[260px]" type="submit">
          Submit
        </Button>
      </form>
    </div>
  </main>
</template>