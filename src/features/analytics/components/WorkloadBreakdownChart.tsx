import { motion } from 'framer-motion';
import { Avatar } from '@/components/ui/Avatar';
import { getUserById } from '@/mock-data';
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/cn';

function toneFor(value: number) {
  if (value >= 85) return 'bg-danger-500';
  if (value >= 65) return 'bg-gold-500';
  return 'bg-success-500';
}

export function WorkloadBreakdownChart({ data }: { data: { userId: string; value: number }[] }) {
  return (
    <motion.div variants={staggerContainer(0.06)} initial="hidden" whileInView="visible" viewport={viewportOnce} className="flex flex-col gap-3.5">
      {data.map((entry) => {
        const user = getUserById(entry.userId);
        if (!user) return null;
        return (
          <motion.div key={entry.userId} variants={fadeUp} className="flex items-center gap-3">
            <Avatar name={user.name} color={user.color} size="xs" />
            <span className="w-28 shrink-0 truncate text-xs text-text-secondary">{user.name}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-border-default">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${entry.value}%` }}
                viewport={viewportOnce}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className={cn('h-full rounded-full', toneFor(entry.value))}
              />
            </div>
            <span className="w-9 shrink-0 text-right font-mono text-xs text-text-tertiary">{entry.value}%</span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
