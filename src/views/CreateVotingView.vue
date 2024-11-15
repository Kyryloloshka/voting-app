<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import * as z from 'zod';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useVotingStore } from '@/store/useVotingStore';

const votingStore = useVotingStore();
const router = useRouter();

const options = reactive<string[]>(['']);

const handleInputOptionChange = () => {
  if (options[options.length - 1] !== '') {
    options.push('');
  }
  while (options.length >= 2 && options[options.length - 1] === '' && options[options.length - 2] === '') {
    options.pop();
  }
};

const formSchema = toTypedSchema(z.object({
  question: z.string().min(1, 'Provide question').max(50, 'Question is too long :('),
  options: z.string().array().optional(),
  multiChoice: z.boolean().default(false),
}));

const { handleSubmit, setFieldError } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit((values) => {
  values.options = [...options.filter((option) => option !== '')];
  if (values.options.length < 2) {
    setFieldError('options', 'Provide at least two valid options');
    return;
  }

  votingStore.addVoting({
    id: `vote-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    question: values.question,
    options: values.options,
    multiChoice: values.multiChoice,
    user: votingStore.user,
    showResults: true,
    createDate: new Date().toISOString(),
    usersVotes: [
      {
        options: [values.options[0]],
        user: {
          name: 'test_user2',
          email: 'test2@test.com',
        },
      },
      {
        options: [values.options[0]],
        user: {
          name: 'test_user3',
          email: 'test3@test.com',
        },
      },
      {
        options: [values.options[1]],
        user: {
          name: 'test_user4',
          email: 'test4@test.com',
        },
      },
    ],
  });
  router.push('/all-votes');
});
</script>

<template>
  <main class="container pt-12">
    <div class="flex items-center flex-col gap-3 text-center">
      <h2 class="text-2xl font-medium mb-3">Create Voting</h2>
      <form class="space-y-6 flex flex-col" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="question">
          <FormItem class="flex flex-col items-center">
            <FormLabel class="text-light-500 mb-2">Type your question</FormLabel>
            <FormControl class="max-w-[360px]">
              <Input type="text" placeholder="question" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField name="options">
          <FormItem class="flex flex-col items-center">
            <FormLabel class="text-light-500 mb-2">Select options</FormLabel>
            <div class="space-y-3 w-full">
              <div v-for="(_, index) in options" :key="index" class="flex gap-3 items-center">
                <Input
                  v-model="options[index]"
                  type="text"
                  :placeholder="`option ${index+1}`"
                  class="max-w-[360px]"
                  @input="handleInputOptionChange()"
                />
              </div>
            </div>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField name="multiChoice" v-slot="{value, handleChange}">
          <Label class="flex flex-nowrap items-center gap-3">
            <checkbox
              @update:checked="handleChange"
              :checked="value"
            />
            <span>
              Multi choice
            </span>
          </Label>
        </FormField>
        <Button class="min-w-[260px]" type="submit">
          Submit
        </Button>
      </form>
    </div>
  </main>
</template>