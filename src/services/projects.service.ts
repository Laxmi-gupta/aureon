import type { CreateProjectInput, Project, UpdateProjectInput } from '@/types';
import { projects as seedProjects } from '@/mock-data';
import { createId } from '@/lib/id';
import { withLatency } from './latency';

export interface ProjectsService {
  list(): Promise<Project[]>;
  getById(id: string): Promise<Project | null>;
  create(input: CreateProjectInput): Promise<Project>;
  update(id: string, input: UpdateProjectInput): Promise<Project>;
  remove(id: string): Promise<void>;
}

let store = [...seedProjects];

class MockProjectsService implements ProjectsService {
  async list(): Promise<Project[]> {
    return withLatency([...store]);
  }

  async getById(id: string): Promise<Project | null> {
    return withLatency(store.find((project) => project.id === id) ?? null);
  }

  async create(input: CreateProjectInput): Promise<Project> {
    const project: Project = {
      id: createId('p'),
      status: 'planning',
      health: 'on-track',
      progress: 0,
      milestones: [],
      ...input,
    };
    store = [project, ...store];
    return withLatency(project);
  }

  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    const existing = store.find((project) => project.id === id);
    if (!existing) throw new Error(`Project ${id} not found`);
    const updated: Project = { ...existing, ...input };
    store = store.map((project) => (project.id === id ? updated : project));
    return withLatency(updated);
  }

  async remove(id: string): Promise<void> {
    store = store.filter((project) => project.id !== id);
    return withLatency(undefined);
  }
}

export const projectsService: ProjectsService = new MockProjectsService();
