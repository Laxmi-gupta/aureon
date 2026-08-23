import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Check, CheckCheck, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { Task, TaskStatus } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { toast } from '@/components/ui/toast';
import { tasksService } from '@/services';
import { getProjectById } from '@/mock-data';
import { formatDueDate, isOverdue } from '@/lib/format';
import { STATUS_CONFIG, STATUS_ORDER } from '../task-status-config';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/cn';

export function MyTasksView({ tasks, onEdit }: { tasks: Task[]; onEdit: (task: Task) => void }) {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) => tasksService.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tasksService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted');
      setDeleteId(null);
    },
  });

  if (tasks.length === 0) {
    return <EmptyState icon={CheckCheck} title="No tasks assigned to you" description="Tasks assigned to you will show up here." />;
  }

  return (
    <div className="flex flex-col gap-6">
      {STATUS_ORDER.map((status) => {
        const group = tasks.filter((t) => t.status === status);
        if (group.length === 0) return null;
        const config = STATUS_CONFIG[status];
        return (
          <div key={status}>
            <div className="mb-2 flex items-center gap-2">
              <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
              <h3 className="text-xs font-medium uppercase tracking-wide text-text-tertiary">
                {config.label} · {group.length}
              </h3>
            </div>
            <Card>
              <CardContent className="p-0">
                <motion.ul variants={staggerContainer(0.04)} initial="hidden" animate="visible" className="flex flex-col">
                  {group.map((task) => {
                    const project = getProjectById(task.projectId);
                    const overdue = isOverdue(task.dueDate) && task.status !== 'completed';
                    return (
                      <motion.li
                        key={task.id}
                        variants={fadeUp}
                        className="flex items-center gap-3 border-b border-border-default px-4 py-3 last:border-0"
                      >
                        <button
                          onClick={() =>
                            statusMutation.mutate({ id: task.id, status: task.status === 'completed' ? 'planned' : 'completed' })
                          }
                          className={cn(
                            'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors',
                            task.status === 'completed' ? 'border-success-500 bg-success-500 text-ink-950' : 'border-border-strong text-transparent hover:border-accent',
                          )}
                          aria-label="Toggle complete"
                        >
                          <Check size={11} strokeWidth={3} />
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className={cn('truncate text-sm font-medium', task.status === 'completed' ? 'text-text-tertiary line-through' : 'text-text-primary')}>
                            {task.title}
                          </p>
                          <p className="truncate text-xs text-text-tertiary">{project?.name}</p>
                        </div>
                        <PriorityBadge priority={task.priority} className="hidden sm:inline-flex" />
                        <span className={cn('shrink-0 text-xs font-medium', overdue ? 'text-danger-400' : 'text-text-tertiary')}>
                          {overdue ? 'Overdue' : formatDueDate(task.dueDate)}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="rounded-md p-1.5 text-text-tertiary hover:bg-surface-overlay hover:text-text-primary">
                              <MoreHorizontal size={15} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => onEdit(task)}>
                              <Pencil size={13} /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem destructive onSelect={() => setDeleteId(task.id)}>
                              <Trash2 size={13} /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </CardContent>
            </Card>
          </div>
        );
      })}

      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete task"
        description="This task will be permanently removed. This can't be undone."
        confirmLabel="Delete"
        tone="danger"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </div>
  );
}
