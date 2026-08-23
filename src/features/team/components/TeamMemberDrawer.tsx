import { useQuery } from '@tanstack/react-query';
import type { User } from '@/types';
import { SlideOver } from '@/components/ui/SlideOver';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { ActivityFeed } from '@/components/shared/ActivityFeed';
import { EmptyState } from '@/components/ui/EmptyState';
import { tasksService, activityService } from '@/services';
import { formatDueDate } from '@/lib/format';
import { ListChecks } from 'lucide-react';

export function TeamMemberDrawer({ user, onOpenChange }: { user: User | null; onOpenChange: (open: boolean) => void }) {
  const { data: tasks = [] } = useQuery({ queryKey: ['tasks'], queryFn: tasksService.list });
  const { data: activity = [] } = useQuery({ queryKey: ['activity'], queryFn: activityService.list });

  if (!user) return null;

  const myTasks = tasks.filter((t) => t.assigneeId === user.id && t.status !== 'completed');
  const myActivity = activity.filter((a) => a.actorId === user.id);
  const completionRate = user.activeTasks + user.completedTasks > 0
    ? Math.round((user.completedTasks / (user.activeTasks + user.completedTasks)) * 100)
    : 0;

  return (
    <SlideOver open={Boolean(user)} onOpenChange={onOpenChange} title={user.name} description={user.title}>
      <div className="flex flex-col gap-6 p-5">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} color={user.color} size="lg" />
          <div>
            <p className="text-sm font-medium text-text-primary">{user.name}</p>
            <p className="text-xs text-text-tertiary">{user.email}</p>
            <p className="mt-1 text-xs capitalize text-text-tertiary">
              {user.role} · {user.department}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border-default p-3 text-center">
            <p className="font-mono text-lg font-medium text-text-primary">{user.activeTasks}</p>
            <p className="mt-0.5 text-[10px] text-text-tertiary">Active</p>
          </div>
          <div className="rounded-xl border border-border-default p-3 text-center">
            <p className="font-mono text-lg font-medium text-text-primary">{user.completedTasks}</p>
            <p className="mt-0.5 text-[10px] text-text-tertiary">Completed</p>
          </div>
          <div className="rounded-xl border border-border-default p-3 text-center">
            <p className="font-mono text-lg font-medium text-text-primary">{completionRate}%</p>
            <p className="mt-0.5 text-[10px] text-text-tertiary">Completion</p>
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs text-text-tertiary">
            <span>Current workload</span>
            <span className="font-mono text-text-secondary">{user.workload}%</span>
          </div>
          <ProgressBar value={user.workload} />
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">Open tasks</p>
          {myTasks.length === 0 ? (
            <EmptyState icon={ListChecks} title="No open tasks" />
          ) : (
            <ul className="flex flex-col gap-1">
              {myTasks.slice(0, 6).map((task) => (
                <li key={task.id} className="flex items-center gap-2.5 rounded-lg px-1 py-2">
                  <p className="min-w-0 flex-1 truncate text-xs font-medium text-text-primary">{task.title}</p>
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                  <span className="shrink-0 text-[11px] text-text-tertiary">{formatDueDate(task.dueDate)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">Recent activity</p>
          <ActivityFeed events={myActivity} limit={6} />
        </div>
      </div>
    </SlideOver>
  );
}
