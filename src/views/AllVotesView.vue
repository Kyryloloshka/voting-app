<script setup lang="ts">
import VotingBlock from '@/components/VotingBlock/VotingBlock.vue';
import { ref } from 'vue';
import { Voter } from '@/types';
import { Button } from '@/components/ui/button';
import { useVotingStore } from '@/store/useVotingStore.ts';

const usersVotes = ref<Voter[]>([]);
const votingStore = useVotingStore();

</script>

<template>
  <main class="container mt-6">
    <h2 class="text-2xl font-medium tracking-wider text-center mb-6">All votes</h2>
    <div class="gap-3 grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))]">
      <div v-for="(voting, index) in votingStore.votes" :key="index">
        <voting-block
          :voting="voting"
          :users-votes="usersVotes"
        />
      </div>
    </div>
    <div v-if="votingStore.votes.length === 0" class="text-center flex flex-col gap-3">
      <h3 class="text-light-300">There is no votes yet :(</h3>
      <h4 class="text-light-600">Go to create your own voting</h4>
      <router-link to="/create-voting">
        <Button>+ Create Voting</Button>
      </router-link>
    </div>
  </main>
</template>

<style scoped>
</style>
