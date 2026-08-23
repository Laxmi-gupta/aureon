import { motion } from 'framer-motion';
import type { Task } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { UserChip } from '@/components/shared/UserChip';
import { EmptyState } from '@/components/ui/EmptyState';
import { getUserById, getProjectById } from '@/mock-data';
import { formatDueDate, isOverdue } from '@/lib/format';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { ListChecks } from 'lucide-react';

export function TaskListView({ tasks, onTaskClick }: { tasks: Task[]; onTaskClick: (task: Task) => void }) {
  if (tasks.length === 0) {
    return <EmptyState icon={ListChecks} title="No tasks match your filters" description="Try adjusting search or filters." />;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border-default bg-surface-raised">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border-default text-[11px] uppercase tracking-wide text-text-tertiary">
            <th className="py-3 pl-4 pr-3 font-medium">Task</th>
            <th className="px-3 py-3 font-medium">Project</th>
            <th className="px-3 py-3 font-medium">Status</th>
            <th className="px-3 py-3 font-medium">Priority</th>
            <th className="px-3 py-3 font-medium">Assignee</th>
            <th className="px-3 py-3 pr-4 font-medium">Due</th>
          </tr>
        </thead>
        <motion.tbody variants={staggerContainer(0.03)} initial="hidden" animate="visible">
          {tasks.map((task) => {
            const project = getProjectById(task.projectId);
            const assignee = getUserById(task.assigneeId);
            const overdue = isOverdue(task.dueDate) && task.status !== 'completed';
            return (
              <motion.tr
                key={task.id}
                variants={fadeUp}
                role="button"
                tabIndex={0}
                onClick={() => onTaskClick(task)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onTaskClick(task);
                  }
                }}
                className="cursor-pointer border-b border-border-default transition-colors last:border-0 hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              >
                <td className="py-3 pl-4 pr-3">
                  <p className="max-w-[240px] truncate text-sm font-medium text-text-primary">{task.title}</p>
                </td>
                <td className="px-3 py-3 text-xs text-text-tertiary">{project?.name ?? '—'}</td>
                <td className="px-3 py-3">
                  <StatusBadge status={task.status} />
                </td>
                <td className="px-3 py-3">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="px-3 py-3">
                  <UserChip user={assignee} />
                </td>
                <td className={cn('px-3 py-3 pr-4 text-xs font-medium', overdue ? 'text-danger-400' : 'text-text-tertiary')}>
                  {overdue ? 'Overdue' : formatDueDate(task.dueDate)}
                </td>
              </motion.tr>
            );
          })}
        </motion.tbody>
      </table>
    </div>
  );
}
