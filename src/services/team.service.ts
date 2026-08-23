import type { User } from '@/types';
import { users } from '@/mock-data';
import { withLatency } from './latency';

export interface TeamService {
  list(): Promise<User[]>;
  getById(id: string): Promise<User | null>;
}

class MockTeamService implements TeamService {
  async list(): Promise<User[]> {
    return withLatency([...users]);
  }

  async getById(id: string): Promise<User | null> {
    return withLatency(users.find((user) => user.id === id) ?? null);
  }
}

export const teamService: TeamService = new MockTeamService();
