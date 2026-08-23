import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, MessageSquareWarning, X } from 'lucide-react';
import type { ApprovalRequest } from '@/types';
import { SlideOver } from '@/components/ui/SlideOver';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { UserChip } from '@/components/shared/UserChip';
import { toast } from '@/components/ui/toast';
import { ApprovalHistoryTimeline } from './ApprovalHistoryTimeline';
import { DecisionDialog } from './DecisionDialog';
import type { DecisionAction } from './DecisionDialog';
import { approvalsService } from '@/services';
import { getUserById } from '@/mock-data';
import { formatCurrency, formatDate } from '@/lib/format';

interface ApprovalDetailDrawerProps {
  approval: ApprovalRequest | null;
  onOpenChange: (open: boolean) => void;
}

export function ApprovalDetailDrawer({ approval, onOpenChange }: ApprovalDetailDrawerProps) {
  const queryClient = useQueryClient();
  const [action, setAction] = useState<DecisionAction | null>(null);

  const mutation = useMutation({
    mutationFn: ({ action, note }: { action: DecisionAction; note: string }) => {
      if (!approval) throw new Error('No approval selected');
      const input = note ? { note } : undefined;
      if (action === 'approve') return approvalsService.approve(approval.id, input);
      if (action === 'reject') return approvalsService.reject(approval.id, input);
      return approvalsService.requestChanges(approval.id, input);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      const label = variables.action === 'approve' ? 'Approved' : variables.action === 'reject' ? 'Rejected' : 'Changes requested';
      toast.success(label, approval?.title);
      setAction(null);
    },
    onError: () => toast.error("Couldn't record decision", 'Please try again.'),
  });

  if (!approval) return null;
  const requester = getUserById(approval.requesterId);
  const canDecide = approval.status === 'pending' || approval.status === 'changes-requested';

  return (
    <>
      <SlideOver open={Boolean(approval)} onOpenChange={onOpenChange} title={approval.title} description={approval.type}>
        <div className="flex flex-col gap-6 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={approval.status} />
            <PriorityBadge priority={approval.priority} />
          </div>

          <p className="text-sm leading-relaxed text-text-secondary">{approval.description}</p>

          <dl className="grid grid-cols-2 gap-4 rounded-xl border border-border-default p-4 text-xs">
            <div>
              <dt className="text-text-tertiary">Requester</dt>
              <dd className="mt-1">
                <UserChip user={requester} />
              </dd>
            </div>
            <div>
              <dt className="text-text-tertiary">Requested</dt>
              <dd className="mt-1 text-text-primary">{formatDate(approval.requestedAt)}</dd>
            </div>
            <div>
              <dt className="text-text-tertiary">Current stage</dt>
              <dd className="mt-1 text-text-primary">{approval.currentStage}</dd>
            </div>
            {approval.amount !== undefined && (
              <div>
                <dt className="text-text-tertiary">Amount</dt>
                <dd className="mt-1 font-mono text-text-primary">{formatCurrency(approval.amount)}</dd>
              </div>
            )}
          </dl>

          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-tertiary">History</p>
            <ApprovalHistoryTimeline history={approval.history} />
          </div>
        </div>

        {canDecide && (
          <div className="sticky bottom-0 flex items-center gap-2 border-t border-border-default bg-surface-raised p-4">
            <Button variant="danger" className="flex-1" icon={<X size={14} />} onClick={() => setAction('reject')}>
              Reject
            </Button>
            <Button variant="secondary" className="flex-1" icon={<MessageSquareWarning size={14} />} onClick={() => setAction('changes')}>
              Changes
            </Button>
            <Button className="flex-1" icon={<Check size={14} />} onClick={() => setAction('approve')}>
              Approve
            </Button>
          </div>
        )}
      </SlideOver>

      <DecisionDialog
        action={action}
        onOpenChange={(open) => !open && setAction(null)}
        loading={mutation.isPending}
        onConfirm={(note) => action && mutation.mutate({ action, note })}
      />
    </>
  );
}
