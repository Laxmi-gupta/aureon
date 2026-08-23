import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none tracking-wide',
  {
    variants: {
      tone: {
        neutral: 'border-border-strong bg-surface-raised text-text-secondary',
        gold: 'border-gold-500/30 bg-gold-500/10 text-gold-400',
        success: 'border-success-500/30 bg-success-500/10 text-success-400',
        warning: 'border-warning-500/30 bg-warning-500/10 text-warning-400',
        danger: 'border-danger-500/30 bg-danger-500/10 text-danger-400',
        info: 'border-info-500/30 bg-info-500/10 text-info-400',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, tone, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone }), className)} {...props}>
      {dot && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />}
      {children}
    </span>
  );
}
