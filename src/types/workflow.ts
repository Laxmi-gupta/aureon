import type { Role } from './common';

export type WorkflowNodeType = 'trigger' | 'approval' | 'review' | 'action' | 'condition' | 'end';

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  title: string;
  description?: string;
  assigneeRole?: Role;
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  usageCount: number;
  avgCompletionHours: number;
  accent: string;
}
