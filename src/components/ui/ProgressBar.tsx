import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { transition } from '@/lib/motion';

interface ProgressBarProps {
  value: number;
  tone?: 'accent' | 'success' | 'warning' | 'danger';
  className?: string;
  trackClassName?: string;
}

const TONE_MAP: Record<NonNullable<ProgressBarProps['tone']>, string> = {
  accent: 'bg-gold-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
};

export function ProgressBar({ value, tone = 'accent', className, trackClassName }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-border-default', trackClassName)}>
      <motion.div
        className={cn('h-full rounded-full', TONE_MAP[tone], className)}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={transition.slow}
      />
    </div>
  );
}
