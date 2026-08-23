import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, TaskStatus } from '@/types';
import { STATUS_CONFIG } from '../task-status-config';
import { KanbanCard } from './KanbanCard';
import { cn } from '@/lib/cn';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function KanbanColumn({ status, tasks, onTaskClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const config = STATUS_CONFIG[status];

  return (
    <div className="flex w-[280px] shrink-0 flex-col rounded-2xl border border-border-default bg-surface-raised/60 sm:w-full">
      <div className="flex items-center gap-2 border-b border-border-default px-4 py-3">
        <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
        <h3 className="text-[13px] font-medium text-text-primary">{config.label}</h3>
        <span className="ml-auto rounded-full bg-surface-overlay px-2 py-0.5 text-[11px] text-text-tertiary">{tasks.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={cn('flex min-h-[120px] flex-1 flex-col gap-2.5 p-3 transition-colors', isOver && 'bg-accent/5')}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
