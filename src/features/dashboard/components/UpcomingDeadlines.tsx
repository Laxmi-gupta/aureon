import { useMemo } from 'react';
import { CalendarClock, CheckSquare, Flag } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Project, Task } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDueDate, isOverdue } from '@/lib/format';
import { cn } from '@/lib/cn';

interface DeadlineItem {
  id: string;
  label: string;
  date: string;
  kind: 'task' | 'milestone' | 'project';
  meta?: string;
}

const ICONS: Record<DeadlineItem['kind'], LucideIcon> = {
  task: CheckSquare,
  milestone: Flag,
  project: CalendarClock,
};

const WINDOW_MS = 14 * 24 * 60 * 60 * 1000;
const OVERDUE_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;

export function UpcomingDeadlines({ tasks, projects }: { tasks: Task[]; projects: Project[] }) {
  // Captured once per mount as a stable filtering baseline, not re-evaluated on every render.
  // oxlint-disable-next-line react/purity
  const now = useMemo(() => Date.now(), []);

  const items: DeadlineItem[] = [
    ...tasks
      .filter((t) => t.status !== 'completed')
      .map((t) => ({ id: `task-${t.id}`, label: t.title, date: t.dueDate, kind: 'task' as const })),
    ...projects.flatMap((p) =>
      p.milestones
        .filter((m) => !m.completed)
        .map((m) => ({ id: `milestone-${m.id}`, label: m.title, date: m.dueDate, kind: 'milestone' as const, meta: p.name })),
    ),
  ]
    .filter((item) => {
      const delta = new Date(item.date).getTime() - now;
      return delta >= -OVERDUE_WINDOW_MS && delta <= WINDOW_MS;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 7);

  return (
    <Card>
      <CardHeader>
        <div>
          <h3 className="text-sm font-medium text-text-primary">Upcoming deadlines</h3>
          <p className="mt-0.5 text-xs text-text-tertiary">Tasks and milestones due soon</p>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        {items.length === 0 ? (
          <EmptyState icon={CalendarClock} title="Nothing due soon" description="You're ahead of schedule." />
        ) : (
          <ul className="flex flex-col gap-1">
            {items.map((item) => {
              const Icon = ICONS[item.kind];
              const overdue = isOverdue(item.date);
              return (
                <li key={item.id} className="flex items-center gap-3 rounded-lg px-1 py-2">
                  <span
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                      overdue ? 'bg-danger-500/10 text-danger-400' : 'bg-surface-overlay text-text-tertiary',
                    )}
                  >
                    <Icon size={13} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-text-primary">{item.label}</p>
                    {item.meta && <p className="truncate text-[11px] text-text-tertiary">{item.meta}</p>}
                  </div>
                  <span className={cn('shrink-0 text-[11px] font-medium', overdue ? 'text-danger-400' : 'text-text-tertiary')}>
                    {overdue ? 'Overdue' : formatDueDate(item.date)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
