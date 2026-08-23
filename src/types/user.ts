import type { Role } from './common';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  department: string;
  color: string;
  activeTasks: number;
  completedTasks: number;
  workload: number;
  timezone: string;
  joinedAt: string;
}
