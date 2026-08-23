import type { CreateTaskInput, Task, TaskStatus, UpdateTaskInput } from '@/types';
import { tasks as seedTasks } from '@/mock-data';
import { createId } from '@/lib/id';
import { withLatency } from './latency';

export interface TasksService {
  list(): Promise<Task[]>;
  getById(id: string): Promise<Task | null>;
  create(input: CreateTaskInput): Promise<Task>;
  update(id: string, input: UpdateTaskInput): Promise<Task>;
  updateStatus(id: string, status: TaskStatus): Promise<Task>;
  remove(id: string): Promise<void>;
}

let store = [...seedTasks];

class MockTasksService implements TasksService {
  async list(): Promise<Task[]> {
    return withLatency([...store]);
  }

  async getById(id: string): Promise<Task | null> {
    return withLatency(store.find((task) => task.id === id) ?? null);
  }

  async create(input: CreateTaskInput): Promise<Task> {
    const now = new Date().toISOString();
    const task: Task = { id: createId('t'), createdAt: now, updatedAt: now, ...input };
    store = [task, ...store];
    return withLatency(task);
  }

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const existing = store.find((task) => task.id === id);
    if (!existing) throw new Error(`Task ${id} not found`);
    const updated: Task = { ...existing, ...input, updatedAt: new Date().toISOString() };
    store = store.map((task) => (task.id === id ? updated : task));
    return withLatency(updated);
  }

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.update(id, { status });
  }

  async remove(id: string): Promise<void> {
    store = store.filter((task) => task.id !== id);
    return withLatency(undefined);
  }
}

export const tasksService: TasksService = new MockTasksService();
