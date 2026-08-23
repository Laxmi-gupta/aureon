import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task, TaskStatus } from '@/types';
import { STATUS_ORDER } from '../task-status-config';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { tasksService } from '@/services';
import { toast } from '@/components/ui/toast';

function resolveStatus(overId: string, tasks: Task[]): TaskStatus | null {
  if ((STATUS_ORDER as string[]).includes(overId)) return overId as TaskStatus;
  return tasks.find((t) => t.id === overId)?.status ?? null;
}

export function KanbanBoard({ tasks, onTaskClick }: { tasks: Task[]; onTaskClick: (task: Task) => void }) {
  const queryClient = useQueryClient();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) => tasksService.updateStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previous = queryClient.getQueryData<Task[]>(['tasks']);
      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old?.map((t) => (t.id === id ? { ...t, status } : t)),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(['tasks'], context.previous);
      toast.error("Couldn't move task", 'Please try again.');
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;
    const task = tasks.find((t) => t.id === active.id);
    if (!task) return;
    const newStatus = resolveStatus(String(over.id), tasks);
    if (newStatus && newStatus !== task.status) {
      mutation.mutate({ id: task.id, status: newStatus });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
        {STATUS_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks.filter((t) => t.status === status)}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>

      <DragOverlay>{activeTask && <KanbanCard task={activeTask} onClick={() => {}} />}</DragOverlay>
    </DndContext>
  );
}
