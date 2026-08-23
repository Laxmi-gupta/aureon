import { ArrowDown, ArrowRight, ArrowUp, AlertTriangle } from 'lucide-react';
import type { Priority } from '@/types';
import { Badge } from '@/components/ui/Badge';

const CONFIG: Record<Priority, { label: string; tone: 'neutral' | 'info' | 'warning' | 'danger'; icon: typeof ArrowDown }> = {
  low: { label: 'Low', tone: 'neutral', icon: ArrowDown },
  medium: { label: 'Medium', tone: 'info', icon: ArrowRight },
  high: { label: 'High', tone: 'warning', icon: ArrowUp },
  urgent: { label: 'Urgent', tone: 'danger', icon: AlertTriangle },
};

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  const { label, tone, icon: Icon } = CONFIG[priority];
  return (
    <Badge tone={tone} className={className}>
      <Icon size={11} strokeWidth={2.25} />
      {label}
    </Badge>
  );
}
