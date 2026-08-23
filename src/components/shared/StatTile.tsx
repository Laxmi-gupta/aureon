import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { fadeUp } from '@/lib/motion';
import { cn } from '@/lib/cn';

interface StatTileProps {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  tone?: 'default' | 'gold';
}

export function StatTile({ label, value, suffix = '', icon: Icon, trend, tone = 'default' }: StatTileProps) {
  return (
    <motion.div variants={fadeUp}>
      <Card className="p-5">
        <div className="flex items-start justify-between">
          <span
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg',
              tone === 'gold' ? 'bg-accent/10 text-accent' : 'bg-surface-overlay text-text-secondary',
            )}
          >
            <Icon size={16} strokeWidth={1.75} />
          </span>
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 text-[11px] font-medium',
                trend.positive ? 'text-success-400' : 'text-danger-400',
              )}
            >
              {trend.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {trend.value}%
            </span>
          )}
        </div>
        <p className="mt-4 font-mono text-2xl font-medium text-text-primary">
          <AnimatedCounter value={value} suffix={suffix} />
        </p>
        <p className="mt-1 text-[13px] text-text-tertiary">{label}</p>
      </Card>
    </motion.div>
  );
}
