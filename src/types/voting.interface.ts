import { User } from '@/types';
import { Voter } from '@/types/voter.interface.ts';

export interface Voting {
  id: string;
  options: string[];
  question: string;
  multiChoice: boolean;
  user: User;
  showResults: boolean;
  usersVotes: Voter[];
  createDate: string;
}