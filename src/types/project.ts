import type { Health, Priority } from './common';

export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed';

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  health: Health;
  ownerId: string;
  memberIds: string[];
  startDate: string;
  deadline: string;
  progress: number;
  milestones: Milestone[];
  accent: string;
  tags: string[];
}

export interface CreateProjectInput {
  name: string;
  description: string;
  priority: Priority;
  ownerId: string;
  memberIds: string[];
  startDate: string;
  deadline: string;
  accent: string;
  tags: string[];
}

export type UpdateProjectInput = Partial<CreateProjectInput> & {
  status?: ProjectStatus;
  progress?: number;
  health?: Health;
};
