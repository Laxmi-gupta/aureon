import { useNavigate } from 'react-router-dom';
import type { Task } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { formatDueDate, isOverdue } from '@/lib/format';
import { cn } from '@/lib/cn';
import { CheckCheck, ListChecks } from 'lucide-react';

export function MyTasksPanel({ tasks, userId }: { tasks: Task[]; userId?: string }) {
  const navigate = useNavigate();
  const mine = tasks.filter((t) => t.assigneeId === userId);
  const open = mine.filter((t) => t.status !== 'completed').sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const completedCount = mine.length - open.length;

  return (
    <Card>
      <CardHeader>
        <div>
          <h3 className="text-sm font-medium text-text-primary">My tasks</h3>
          <p className="mt-0.5 text-xs text-text-tertiary">
            {open.length} open · {completedCount} completed
          </p>
        </div>
        <Button size="sm" variant="ghost" onClick={() => navigate('/app/tasks')}>
          View all
        </Button>
      </CardHeader>
      <CardContent className="pt-3">
        {open.length === 0 ? (
          <EmptyState icon={CheckCheck} title="You're all caught up" description="No open tasks assigned to you." />
        ) : (
          <ul className="flex flex-col gap-1">
            {open.slice(0, 5).map((task) => {
              const overdue = isOverdue(task.dueDate) && task.status !== 'completed';
              return (
                <li
                  key={task.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-2.5 transition-colors hover:bg-surface-overlay"
                  onClick={() => navigate('/app/tasks')}
                >
                  <ListChecks size={14} className="shrink-0 text-text-tertiary" />
                  <p className="min-w-0 flex-1 truncate text-xs font-medium text-text-primary">{task.title}</p>
                  <PriorityBadge priority={task.priority} />
                  <span className={cn('shrink-0 text-[11px] font-medium', overdue ? 'text-danger-400' : 'text-text-tertiary')}>
                    {overdue ? 'Overdue' : formatDueDate(task.dueDate)}
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
