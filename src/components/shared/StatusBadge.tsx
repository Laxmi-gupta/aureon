import type { ApprovalStatus, ProjectStatus, TaskStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';

type AnyStatus = ProjectStatus | TaskStatus | ApprovalStatus;

const CONFIG: Record<AnyStatus, { label: string; tone: 'neutral' | 'gold' | 'success' | 'warning' | 'danger' | 'info' }> = {
  planning: { label: 'Planning', tone: 'neutral' },
  active: { label: 'Active', tone: 'gold' },
  'on-hold': { label: 'On Hold', tone: 'neutral' },
  completed: { label: 'Completed', tone: 'success' },
  planned: { label: 'Planned', tone: 'neutral' },
  'in-progress': { label: 'In Progress', tone: 'info' },
  review: { label: 'In Review', tone: 'warning' },
  pending: { label: 'Pending', tone: 'warning' },
  approved: { label: 'Approved', tone: 'success' },
  rejected: { label: 'Rejected', tone: 'danger' },
  'changes-requested': { label: 'Changes Requested', tone: 'info' },
};

export function StatusBadge({ status, className }: { status: AnyStatus; className?: string }) {
  const config = CONFIG[status];
  return (
    <Badge tone={config.tone} dot className={className}>
      {config.label}
    </Badge>
  );
}
