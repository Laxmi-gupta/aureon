import { motion, useReducedMotion } from 'framer-motion';
import { Circle, CircleCheck, CircleDot, Eye } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Container } from './Container';
import { SectionHeading } from './SectionHeading';
import { Avatar } from '@/components/ui/Avatar';
import { tasks, getUserById } from '@/mock-data';
import type { TaskStatus } from '@/types';

const COLUMNS: { status: TaskStatus; label: string; icon: LucideIcon }[] = [
  { status: 'planned', label: 'Planned', icon: Circle },
  { status: 'in-progress', label: 'In Progress', icon: CircleDot },
  { status: 'review', label: 'In Review', icon: Eye },
  { status: 'completed', label: 'Completed', icon: CircleCheck },
];

const GHOST_TASK = tasks.find((t) => t.id === 't_1')!;
const TOTAL_DURATION = 7.2;

function ghostKeyframes(index: number, total: number) {
  const start = index / total;
  const end = (index + 1) / total;
  if (index === 0) {
    return { times: [0, end - 0.015, end], opacity: [1, 1, 0], scale: [1, 1, 0.92] };
  }
  if (index === total - 1) {
    return { times: [0, start, start + 0.015, 1], opacity: [0, 0, 1, 1], scale: [0.92, 0.92, 1, 1] };
  }
  return {
    times: [0, start, start + 0.015, end - 0.015, end],
    opacity: [0, 0, 1, 1, 0],
    scale: [0.92, 0.92, 1, 1, 0.92],
  };
}

function ColumnList({ status }: { status: TaskStatus }) {
  const items = tasks.filter((t) => t.status === status && t.id !== 't_1').slice(0, 2);
  return (
    <div className="flex flex-col gap-2">
      {items.map((task) => {
        const assignee = getUserById(task.assigneeId);
        return (
          <div key={task.id} className="rounded-lg border border-ink-700 bg-ink-900/50 p-3">
            <p className="truncate text-xs font-medium text-ink-100">{task.title}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] text-ink-400 capitalize">{task.priority}</span>
              {assignee && <Avatar name={assignee.name} color={assignee.color} size="xs" />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ShowcaseTaskFlow() {
  const prefersReducedMotion = useReducedMotion();
  const assignee = getUserById(GHOST_TASK.assigneeId);

  return (
    <section className="border-t border-ink-800 bg-ink-950 py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Task Flow"
          title="Watch work move — not just get logged."
          description="Every task carries status, priority, and owner as it moves from planned to complete, in full view of the team."
          align="center"
          className="mx-auto"
        />

        <div className="relative mt-14 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {COLUMNS.map((column, index) => {
            const Icon = column.icon;
            const kf = ghostKeyframes(index, COLUMNS.length);
            return (
              <div key={column.status} className="rounded-2xl border border-ink-700 bg-ink-900/40 p-3.5">
                <div className="mb-3 flex items-center gap-1.5 px-1 text-[11px] font-medium uppercase tracking-wide text-ink-400">
                  <Icon size={12} />
                  {column.label}
                </div>

                <motion.div
                  initial={{ opacity: index === 0 ? 1 : 0, scale: index === 0 ? 1 : 0.92 }}
                  whileInView={
                    prefersReducedMotion
                      ? { opacity: index === 0 ? 1 : 0 }
                      : { opacity: kf.opacity, scale: kf.scale }
                  }
                  viewport={{ once: true }}
                  transition={
                    prefersReducedMotion
                      ? undefined
                      : {
                          duration: TOTAL_DURATION,
                          times: kf.times,
                          repeat: Infinity,
                          repeatDelay: 1.4,
                          ease: 'easeInOut',
                        }
                  }
                  className="mb-2 rounded-lg border border-gold-500/40 bg-gold-500/10 p-3 shadow-glow-gold"
                >
                  <p className="truncate text-xs font-medium text-ink-50">{GHOST_TASK.title}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="rounded-full bg-gold-500/20 px-1.5 py-0.5 text-[9px] font-medium text-gold-300">
                      {GHOST_TASK.priority}
                    </span>
                    {assignee && <Avatar name={assignee.name} color={assignee.color} size="xs" />}
                  </div>
                </motion.div>

                <ColumnList status={column.status} />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
