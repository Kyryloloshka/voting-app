<script setup lang="ts">
import {
  FormField,
  FormItem,
} from '@/components/ui/form/index.ts';
import { ref, computed } from 'vue';
import { Checkbox } from '@/components/ui/checkbox/index.ts';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group/index.ts';
import { Label } from '@/components/ui/label/index.ts';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
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
import { Voter } from '@/types';
import { ZodBoolean, ZodDefault } from 'zod';
import { FormMessage } from '@/components/ui/form';

const props = defineProps({
  voting: {
    type: Object,
    required: true,
  },
  usersVotes: {
    type: Array,
    required: true,
  },
});

const selectedOption = ref<string | null>(null);
const selectedOptions = ref<string[]>([]);

const votingStore = useVotingStore();

const votes = computed(() => {
  const voteCount: { [key: string]: number } = {};
  props.voting.usersVotes.forEach(({ options }: { options: string[] }) => {
    options.forEach((option: string) => {
      voteCount[option] = (voteCount[option] || 0) + 1;
    });
  });
  return voteCount;
});

const voted = computed(() => {
  return props.voting.usersVotes.some(
    (voter: Voter) => voter.user.email === votingStore.user.email,
  );
});

const formSchema = toTypedSchema(z.object(props.voting.options.reduce((acc: {
  [key: string]: ZodDefault<ZodBoolean>
}, key: string) => {
  acc[key] = z.boolean().default(false);
  return acc;
}, {})));

const formSchemaRadio = toTypedSchema(z.object({
  answer: z.enum(props.voting.options, {
    required_error: 'You need to select an answer.',
  }).optional(),
}));

const { handleSubmit } = useForm({
  validationSchema: props.voting.multiChoice ? formSchema : formSchemaRadio,
});

const isChecked = (option: string) => {
  if (!voted.value) return false;
  const userVote = props.voting.usersVotes.find(
    (voter: Voter) => voter.user.email === votingStore.user.email,
  );
  return userVote ? userVote.options.includes(option) : false;
};
const getVotedValue = () => {
  if (!voted.value) return null;
  const userVote = props.voting.usersVotes.find(
    (voter: Voter) => voter.user.email === votingStore.user.email,
  );
  return userVote.options[0];
};

const getVotesCount = (optionValue: string) => votes.value[optionValue] || 0;

const getVotesPercentage = (optionValue: string) => {
  if (props.voting.usersVotes.length === 0) return 0;
  return Math.floor((getVotesCount(optionValue) / props.voting.usersVotes.length) * 100);
};

const getUsersVotedOption = (option: string) => {
  return props.voting.usersVotes.filter((vote: Voter) => vote.options.includes(option));
};

const onSubmit = handleSubmit((values) => {
  if (voted.value) return;
  if (!props.voting.multiChoice) {
    selectedOption.value = values.answer;
  }
  if (selectedOption.value === null && !props.voting.multiChoice) return;

  selectedOptions.value = Object.keys(values).filter(key => values[key]);
  const voteData: string[] = props.voting.multiChoice ? selectedOptions.value : [selectedOption.value as string];
  const voter: Voter = { user: votingStore.user, options: voteData };

  votingStore.makeVote(voter, props.voting.id);
  selectedOption.value = null;
});
</script>

<template>
  <form
    class="flex flex-col h-full items-start gap-3 min-w-[250px] max-w-[550px] bg-dark-500 rounded-xl p-4"
    @submit="onSubmit">
    <div class="">
      <h2 class="text-lg leading-[1em] font-medium tracking-wider">{{ props.voting.question }}</h2>
      <span class="text-[12px] text-light-600">{{ new Date(props.voting.createDate).toLocaleString() }}</span>
    </div>
    <div v-if="props.voting.multiChoice" class="flex self-stretch flex-col gap-2">
      <FormField :name="option" v-slot="{ value, handleChange }" v-for="(option, index) in props.voting.options"
                 :key="index">
        <Label class="grid grid-cols-[20px_1fr] items-center gap-x-3 gap-y-1">
          <checkbox
            @update:checked="handleChange"
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
      <FormItem class="w-full">
        <RadioGroup
          :default-value="getVotedValue()"
          v-bind="componentField"
        >
          <Label v-for="(option, index) in props.voting.options"
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
        <FormMessage />
      </FormItem>
    </FormField>
    <Button class="min-w-[180px] mt-auto" v-if="!voted" type="submit">Vote</Button>
    <Dialog v-else>
      <DialogTrigger as-child class="mt-auto">
        <Button class="min-w-[180px]">See results</Button>
      </DialogTrigger>
      <DialogContent class="gap-0 sm:max-w-[425px] p-0">
        <DialogHeader class="p-4 ">
          <DialogTitle>{{ props.voting.question }}</DialogTitle>
          <DialogDescription>
            results of voting
          </DialogDescription>
        </DialogHeader>
        <div class="mb-2" v-for="(option, index) in props.voting.options" :key="index">
          <div class="flex justify-between items-center px-4 min-h-[30px] bg-dark-600/50">
            <h4 class="text-light-400 text-sm">{{ option }} - {{ getVotesPercentage(option) }}%</h4>
            <span
              class="text-light-600 text-sm">{{ getVotesCount(option)
              }} {{ getVotesCount(option) === 1 ? 'vote' : 'votes'
              }}</span>
          </div>
          <div class="min-h-[40px] px-4 flex items-center text-light-200 hover:bg-dark-600/50 transition"
               v-for="(vote, index) in getUsersVotedOption(option)"
               :key="index">
            {{ vote.user.name }}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </form>
</template>
