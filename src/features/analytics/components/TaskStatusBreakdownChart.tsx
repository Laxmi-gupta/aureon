import { motion } from 'framer-motion';
import { STATUS_CONFIG, STATUS_ORDER } from '@/features/tasks/task-status-config';
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';
import type { TaskStatus } from '@/types';

export function TaskStatusBreakdownChart({ data }: { data: { status: string; value: number }[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

  return (
    <motion.div variants={staggerContainer(0.08)} initial="hidden" whileInView="visible" viewport={viewportOnce} className="flex flex-col gap-4">
      {STATUS_ORDER.map((status) => {
        const entry = data.find((d) => d.status === status);
        const value = entry?.value ?? 0;
        const config = STATUS_CONFIG[status as TaskStatus];
        const Icon = config.icon;
        const pct = Math.round((value / total) * 100);

        return (
          <motion.div key={status} variants={fadeUp} className="flex items-center gap-3">
            <span className="flex w-28 shrink-0 items-center gap-1.5 text-xs text-text-secondary">
              <Icon size={13} className="text-text-tertiary" />
              {config.label}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-border-default">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={viewportOnce}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-400"
              />
            </div>
            <span className="w-10 shrink-0 text-right font-mono text-xs text-text-tertiary">{value}</span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
