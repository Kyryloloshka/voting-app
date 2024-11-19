<script setup lang="ts">
import {
  FormField,
  FormItem,
} from '@/components/ui/form/index.ts';
import { ref, computed } from 'vue';
import { Checkbox } from '@/components/ui/checkbox/index.ts';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group/index.ts';
import { Label } from '@/components/ui/label/index.ts';
import { Button } from '@/components/ui/button/index.ts';
import AnimatedProgress from '@/components/ui/progress/AnimatedProgress.vue';
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog/index.ts';
import { useVotingStore } from '@/store/useVotingStore';
import { Voter, Voting } from '@/types';

const props = defineProps<{
  voting: Voting,
  usersVotes: Voter[]
}>();

const selectedOption = ref<string>();
const selectedOptions = ref<string[]>([]);

const error = ref<string>();

const votingStore = useVotingStore();

const votes = computed(() => {
  const voteCount: { [key: string]: number } = {};

  for (const { options } of props.voting.usersVotes) {
    for (const option of options) {
      voteCount[option] = (voteCount[option] || 0) + 1;
    }
  }

  return voteCount;
});

const voted = computed(() => {
  return props.voting.usersVotes.some(
    (voter: Voter) => voter.user.email === votingStore.user.email,
  );
});

const isChecked = (option: string) => {
  if (!voted.value) return false;
  const userVote = props.voting.usersVotes.find(
    (voter: Voter) => voter.user.email === votingStore.user.email,
  );
  return userVote ? userVote.options.includes(option) : false;
};
const getVotedValue = () => {
  if (!voted.value) return undefined;
  const userVote = props.voting.usersVotes.find(
    (voter: Voter) => voter.user.email === votingStore.user.email,
  );
  return userVote?.options[0];
};

const getVotesCount = (optionValue: string) => votes.value[optionValue] || 0;

const getVotesPercentage = (optionValue: string) => {
  if (props.voting.usersVotes.length === 0) return 0;
  return Math.floor((getVotesCount(optionValue) / props.voting.usersVotes.length) * 100);
};

const getUsersVotedOption = (option: string) => {
  return props.voting.usersVotes.filter((vote: Voter) => vote.options.includes(option));
};

const validateForm = (): boolean => {
  if (props.voting.multiChoice) {
    if (selectedOptions.value.length === 0) {
      error.value = 'Please choose at least option';
      return false;
    }
  } else {
    if (!selectedOption.value || !props.voting.options.includes(selectedOption.value)) {
      error.value = 'Please select an answer';
      return false;
    }
  }
  return true;
};

const handleMultiChoice = (option: string, checked: boolean) => {
  if (checked) {
    if (!selectedOptions.value.includes(option)) {
      selectedOptions.value.push(option);
    }
  } else {
    selectedOptions.value = selectedOptions.value.filter((opt) => opt !== option);
  }
};

const onSubmit = () => {
  if (voted.value) return;
  if (!validateForm()) return;

  const voteData: string[] = props.voting.multiChoice ? selectedOptions.value : [selectedOption.value as string];
  const voter: Voter = { user: votingStore.user, options: voteData };

  votingStore.makeVote(voter, props.voting.id);
  selectedOption.value = undefined;
  selectedOptions.value = [];
  error.value = '';
};
</script>

<template>
  <form
    class="flex flex-col h-full items-start gap-3 min-w-[250px] max-w-[550px] bg-dark-500 rounded-xl p-4"
    @submit.prevent="onSubmit">
    <div class="">
      <h2 class="text-lg leading-[1em] font-medium tracking-wider">{{ props.voting.question }}</h2>
      <span class="text-[12px] text-light-600">{{ new Date(props.voting.createDate).toLocaleString() }}</span>
    </div>
    <div v-if="props.voting.multiChoice" class="flex flex-auto self-stretch flex-col gap-2">
      <FormField :name="option" v-slot="{ value }" v-for="(option, index) of props.voting.options"
                 :key="index">
        <Label class="grid grid-cols-[20px_1fr] items-center gap-x-3 gap-y-1">
          <checkbox
            @update:checked="(checked) => handleMultiChoice(option, checked)"
            :value="option"
            :disabled="voted"
            :checked="voted ? isChecked(option) : value"
          />
          {{ option }}
          <span :class="`text-[10px] ${voted ? 'opacity-100' : 'opacity-0'}`">
            {{ getVotesPercentage(option) }}%
          </span>
          <AnimatedProgress v-if="voted" :model-value="getVotesPercentage(option)" />
        </Label>
      </FormField>
    </div>
    <FormField v-else v-slot="{ componentField }" type="radio" name="answer">
      <FormItem class="w-full flex-auto">
        <RadioGroup
          :default-value="getVotedValue()"
          v-model="selectedOption"
          v-bind="componentField">
          <Label v-for="(option, index) of props.voting.options"
                 class="grid grid-cols-[20px_1fr] items-center gap-x-3 gap-y-1"
                 :key="index">
            <RadioGroupItem :disabled="voted" :value="option" />
            {{ option }}
            <span :class="`text-[10px] ${voted ? 'opacity-100' : 'opacity-0'}`">
              {{ getVotesPercentage(option) }}%
            </span>
            <AnimatedProgress v-if="voted" :model-value="getVotesPercentage(option)" />
          </Label>
        </RadioGroup>
      </FormItem>
    </FormField>
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <Button class="min-w-[180px]" v-if="!voted" type="submit">Vote</Button>
    <Dialog v-else>
      <DialogTrigger as-child>
        <Button class="min-w-[180px]">See results</Button>
      </DialogTrigger>
      <DialogContent class="gap-0 sm:max-w-[425px] p-0">
        <DialogHeader class="p-4 ">
          <DialogTitle>{{ props.voting.question }}</DialogTitle>
          <DialogDescription>
            results of voting
          </DialogDescription>
        </DialogHeader>
        <div class="mb-2" v-for="(option, index) of props.voting.options" :key="index">
          <div class="flex justify-between items-center px-4 min-h-[30px] bg-dark-600/50">
            <h4 class="text-light-400 text-sm">{{ option }} - {{ getVotesPercentage(option) }}%</h4>
            <span
              class="text-light-600 text-sm">{{ getVotesCount(option)
              }} {{ getVotesCount(option) === 1 ? 'vote' : 'votes'
              }}</span>
          </div>
          <div class="min-h-[40px] px-4 flex items-center text-light-200 hover:bg-dark-600/50 transition"
               v-for="(vote) of getUsersVotedOption(option)"
               :key="vote.user.email">
            {{ vote.user.name }}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </form>
</template>
