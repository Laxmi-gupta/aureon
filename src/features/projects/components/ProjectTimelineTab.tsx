import { motion } from 'framer-motion';
import { Check, Flag, PlayCircle, Target } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Project } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { formatDate } from '@/lib/format';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/cn';

interface TimelineEntry {
  id: string;
  label: string;
  date: string;
  done: boolean;
  icon: LucideIcon;
}

export function ProjectTimelineTab({ project }: { project: Project }) {
  const entries: TimelineEntry[] = [
    { id: 'start', label: 'Project kicked off', date: project.startDate, done: true, icon: PlayCircle },
    ...project.milestones.map((m) => ({ id: m.id, label: m.title, date: m.dueDate, done: m.completed, icon: Flag })),
    { id: 'deadline', label: 'Target completion', date: project.deadline, done: project.status === 'completed', icon: Target },
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card>
      <CardContent>
        <motion.ol variants={staggerContainer(0.08)} initial="hidden" animate="visible" className="relative flex flex-col">
          {entries.map((entry, index) => (
            <motion.li key={entry.id} variants={fadeUp} className="relative flex gap-4 pb-8 last:pb-0">
              {index < entries.length - 1 && (
                <span
                  className={cn('absolute left-[15px] top-8 h-full w-px', entry.done ? 'bg-success-500/40' : 'bg-border-default')}
                />
              )}
              <span
                className={cn(
                  'z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
                  entry.done ? 'border-success-500 bg-success-500 text-ink-950' : 'border-border-strong bg-surface text-text-tertiary',
                )}
              >
                {entry.done ? <Check size={14} strokeWidth={3} /> : <entry.icon size={14} />}
              </span>
              <div className="pt-1">
                <p className={cn('text-sm font-medium', entry.done ? 'text-text-primary' : 'text-text-secondary')}>{entry.label}</p>
                <p className="mt-0.5 text-xs text-text-tertiary">{formatDate(entry.date)}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </CardContent>
    </Card>
  );
}
