import type { WorkflowTemplate } from '@/types';
import { workflowTemplates } from '@/mock-data';
import { withLatency } from './latency';

export interface WorkflowsService {
  list(): Promise<WorkflowTemplate[]>;
  getById(id: string): Promise<WorkflowTemplate | null>;
}

class MockWorkflowsService implements WorkflowsService {
  async list(): Promise<WorkflowTemplate[]> {
    return withLatency([...workflowTemplates]);
  }

  async getById(id: string): Promise<WorkflowTemplate | null> {
    return withLatency(workflowTemplates.find((template) => template.id === id) ?? null);
  }
}

export const workflowsService: WorkflowsService = new MockWorkflowsService();
