import type { Priority } from './common';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'changes-requested';

export type ApprovalAction = ApprovalStatus | 'submitted' | 'commented';

export interface ApprovalHistoryEntry {
  id: string;
  actorId: string;
  action: ApprovalAction;
  note?: string;
  timestamp: string;
}

export interface ApprovalRequest {
  id: string;
  title: string;
  description: string;
  requesterId: string;
  workflowTemplateId: string;
  type: string;
  priority: Priority;
  status: ApprovalStatus;
  currentStage: string;
  stages: string[];
  amount?: number;
  requestedAt: string;
  history: ApprovalHistoryEntry[];
}

export interface DecisionInput {
  note?: string;
}

export interface CreateApprovalInput {
  title: string;
  description: string;
  requesterId: string;
  workflowTemplateId: string;
  type: string;
  priority: Priority;
  stages: string[];
  amount?: number;
}
