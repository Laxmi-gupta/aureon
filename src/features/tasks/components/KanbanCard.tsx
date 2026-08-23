import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar } from 'lucide-react';
import type { Task } from '@/types';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { Avatar } from '@/components/ui/Avatar';
import { getUserById } from '@/mock-data';
import { formatDueDate, isOverdue } from '@/lib/format';
import { cn } from '@/lib/cn';

export function KanbanCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const assignee = getUserById(task.assigneeId);
  const overdue = isOverdue(task.dueDate) && task.status !== 'completed';

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        'cursor-grab touch-none rounded-xl border border-border-default bg-surface p-3.5 transition-shadow active:cursor-grabbing',
        isDragging ? 'opacity-40 shadow-raised' : 'hover:border-border-strong hover:shadow-soft',
      )}
    >
      <p className="text-[13px] font-medium leading-snug text-text-primary">{task.title}</p>

      {task.labels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.labels.slice(0, 2).map((label) => (
            <span key={label} className="rounded-full bg-surface-overlay px-1.5 py-0.5 text-[10px] text-text-tertiary">
              {label}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <PriorityBadge priority={task.priority} />
        {assignee && <Avatar name={assignee.name} color={assignee.color} size="xs" />}
      </div>

      <div className={cn('mt-2 flex items-center gap-1 text-[11px]', overdue ? 'text-danger-400' : 'text-text-tertiary')}>
        <Calendar size={10} />
        {overdue ? 'Overdue' : formatDueDate(task.dueDate)}
      </div>
    </div>
  );
}
