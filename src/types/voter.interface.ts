import { User } from '@/types/user.interface.ts';

export interface Voter {
  user: User;
  options: string[];
}