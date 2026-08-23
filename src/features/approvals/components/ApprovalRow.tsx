import { motion } from 'framer-motion';
import type { ApprovalRequest } from '@/types';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { UserChip } from '@/components/shared/UserChip';
import { getUserById } from '@/mock-data';
import { formatCurrency, formatDueDate } from '@/lib/format';
import { fadeUp } from '@/lib/motion';

export function ApprovalRow({ approval, onClick }: { approval: ApprovalRequest; onClick: () => void }) {
  const requester = getUserById(approval.requesterId);

  return (
    <motion.div variants={fadeUp}>
      <Card interactive onClick={onClick} className="flex cursor-pointer flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <UserChip user={requester} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-text-primary">{approval.title}</p>
          <p className="mt-0.5 truncate text-xs text-text-tertiary">
            {approval.type} · {approval.currentStage}
          </p>
        </div>
        {approval.amount !== undefined && (
          <span className="shrink-0 font-mono text-xs text-text-secondary">{formatCurrency(approval.amount)}</span>
        )}
        <PriorityBadge priority={approval.priority} />
        <StatusBadge status={approval.status} />
        <span className="shrink-0 text-xs text-text-tertiary">{formatDueDate(approval.requestedAt)}</span>
      </Card>
    </motion.div>
  );
}
