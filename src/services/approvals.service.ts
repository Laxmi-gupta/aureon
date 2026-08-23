import type { ApprovalAction, ApprovalRequest, CreateApprovalInput, DecisionInput } from '@/types';
import { approvals as seedApprovals, CURRENT_USER_ID } from '@/mock-data';
import { createId } from '@/lib/id';
import { withLatency } from './latency';

export interface ApprovalsService {
  list(): Promise<ApprovalRequest[]>;
  getById(id: string): Promise<ApprovalRequest | null>;
  create(input: CreateApprovalInput): Promise<ApprovalRequest>;
  approve(id: string, input?: DecisionInput): Promise<ApprovalRequest>;
  reject(id: string, input?: DecisionInput): Promise<ApprovalRequest>;
  requestChanges(id: string, input?: DecisionInput): Promise<ApprovalRequest>;
}

let store = [...seedApprovals];

function decide(id: string, action: ApprovalAction, input?: DecisionInput): ApprovalRequest {
  const existing = store.find((approval) => approval.id === id);
  if (!existing) throw new Error(`Approval ${id} not found`);

  const status =
    action === 'approved' ? 'approved' : action === 'rejected' ? 'rejected' : 'changes-requested';

  const updated: ApprovalRequest = {
    ...existing,
    status,
    history: [
      ...existing.history,
      {
        id: createId('h'),
        actorId: CURRENT_USER_ID,
        action,
        note: input?.note,
        timestamp: new Date().toISOString(),
      },
    ],
  };

  store = store.map((approval) => (approval.id === id ? updated : approval));
  return updated;
}

class MockApprovalsService implements ApprovalsService {
  async list(): Promise<ApprovalRequest[]> {
    return withLatency([...store]);
  }

  async getById(id: string): Promise<ApprovalRequest | null> {
    return withLatency(store.find((approval) => approval.id === id) ?? null);
  }

  async create(input: CreateApprovalInput): Promise<ApprovalRequest> {
    const now = new Date().toISOString();
    const request: ApprovalRequest = {
      id: createId('a'),
      status: 'pending',
      currentStage: input.stages[0] ?? 'Review',
      requestedAt: now,
      history: [{ id: createId('h'), actorId: input.requesterId, action: 'submitted', timestamp: now }],
      ...input,
    };
    store = [request, ...store];
    return withLatency(request);
  }

  async approve(id: string, input?: DecisionInput): Promise<ApprovalRequest> {
    return withLatency(decide(id, 'approved', input));
  }

  async reject(id: string, input?: DecisionInput): Promise<ApprovalRequest> {
    return withLatency(decide(id, 'rejected', input));
  }

  async requestChanges(id: string, input?: DecisionInput): Promise<ApprovalRequest> {
    return withLatency(decide(id, 'changes-requested', input));
  }
}

export const approvalsService: ApprovalsService = new MockApprovalsService();
