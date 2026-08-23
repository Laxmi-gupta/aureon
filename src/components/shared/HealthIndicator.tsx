import type { Health } from '@/types';
import { cn } from '@/lib/cn';

const CONFIG: Record<Health, { label: string; className: string }> = {
  'on-track': { label: 'On track', className: 'bg-success-500' },
  'at-risk': { label: 'At risk', className: 'bg-warning-500' },
  'off-track': { label: 'Off track', className: 'bg-danger-500' },
};

export function HealthIndicator({ health, className }: { health: Health; className?: string }) {
  const config = CONFIG[health];
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs text-text-secondary', className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', config.className)} />
      {config.label}
    </span>
  );
}
