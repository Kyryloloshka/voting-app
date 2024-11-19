import { defineStore } from 'pinia';
import { User, Voter, Voting } from '@/types';

export const useVotingStore = defineStore('voting', {
  state: () => ({
    user: { name: 'hardcoded_user', email: 'test@test.com' } as User, // хардкод користувача
    votes: JSON.parse(localStorage.getItem('votes') || '[]') as Array<Voting>,
  }),
  actions: {
    addVoting(voting: Voting) {
      this.votes.push(voting);
      localStorage.setItem('votes', JSON.stringify(this.votes));
    },
    makeVote(voter: Voter, id: string) {
      const index = this.votes.findIndex((voting) => voting.id === id);
      this.votes[index].usersVotes.push(voter);
      localStorage.setItem('votes', JSON.stringify(this.votes));
    },
  },
});
