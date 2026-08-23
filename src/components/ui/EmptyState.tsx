import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border-default px-6 py-14 text-center', className)}>
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-overlay text-text-tertiary">
        <Icon size={20} strokeWidth={1.75} />
      </div>
      <h3 className="text-sm font-medium text-text-primary">{title}</h3>
      {description && <p className="max-w-xs text-xs text-text-tertiary">{description}</p>}
      {action}
    </div>
  );
}
