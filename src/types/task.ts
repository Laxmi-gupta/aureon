import type { Priority } from './common';

export type TaskStatus = 'planned' | 'in-progress' | 'review' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assigneeId: string | null;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  labels: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  projectId: string;
  assigneeId: string | null;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  labels: string[];
}

export type UpdateTaskInput = Partial<CreateTaskInput>;

export const TASK_STATUSES: TaskStatus[] = ['planned', 'in-progress', 'review', 'completed'];
