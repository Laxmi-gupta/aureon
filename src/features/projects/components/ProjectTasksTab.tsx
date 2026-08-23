import { motion } from 'framer-motion';
import type { Task } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { UserChip } from '@/components/shared/UserChip';
import { getUserById } from '@/mock-data';
import { formatDueDate, isOverdue } from '@/lib/format';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { ListChecks } from 'lucide-react';

export function ProjectTasksTab({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <EmptyState icon={ListChecks} title="No tasks yet" description="Tasks added to this project will show up here." />;
  }

  const counts = {
    planned: tasks.filter((t) => t.status === 'planned').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    review: tasks.filter((t) => t.status === 'review').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Object.entries(counts).map(([status, count]) => (
          <Card key={status} className="p-4">
            <p className="font-mono text-xl font-medium text-text-primary">{count}</p>
            <p className="mt-0.5 text-xs capitalize text-text-tertiary">{status.replace('-', ' ')}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <motion.ul variants={staggerContainer(0.04)} initial="hidden" animate="visible" className="flex flex-col">
            {tasks.map((task) => {
              const assignee = getUserById(task.assigneeId);
              const overdue = isOverdue(task.dueDate) && task.status !== 'completed';
              return (
                <motion.li
                  key={task.id}
                  variants={fadeUp}
                  className="flex flex-wrap items-center gap-3 border-b border-border-default px-4 py-3 last:border-0"
                >
                  <p className="min-w-[160px] flex-1 truncate text-sm font-medium text-text-primary">{task.title}</p>
                  <StatusBadge status={task.status} />
                  <PriorityBadge priority={task.priority} />
                  <UserChip user={assignee} />
                  <span className={cn('ml-auto shrink-0 text-xs font-medium', overdue ? 'text-danger-400' : 'text-text-tertiary')}>
                    {overdue ? 'Overdue' : formatDueDate(task.dueDate)}
                  </span>
                </motion.li>
              );
            })}
          </motion.ul>
        </CardContent>
      </Card>
    </div>
  );
}
