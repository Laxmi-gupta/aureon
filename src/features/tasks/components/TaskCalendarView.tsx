import { useState } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Task } from '@/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const PRIORITY_DOT: Record<Task['priority'], string> = {
  low: 'bg-ink-300',
  medium: 'bg-info-500',
  high: 'bg-warning-500',
  urgent: 'bg-danger-500',
};

export function TaskCalendarView({ tasks, onTaskClick }: { tasks: Task[]; onTaskClick: (task: Task) => void }) {
  const [cursor, setCursor] = useState(new Date());

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <div className="rounded-2xl border border-border-default bg-surface-raised">
      <div className="flex items-center justify-between border-b border-border-default px-4 py-3">
        <h3 className="text-sm font-medium text-text-primary">{format(cursor, 'MMMM yyyy')}</h3>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" onClick={() => setCursor((d) => subMonths(d, 1))}>
            <ChevronLeft size={15} />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setCursor(new Date())}>
            Today
          </Button>
          <Button size="icon" variant="ghost" onClick={() => setCursor((d) => addMonths(d, 1))}>
            <ChevronRight size={15} />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
      <div className="min-w-[640px]">
      <div className="grid grid-cols-7 border-b border-border-default">
        {WEEKDAYS.map((day) => (
          <div key={day} className="px-2 py-2 text-center text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayTasks = tasks.filter((t) => isSameDay(new Date(t.dueDate), day));
          const inMonth = isSameMonth(day, cursor);
          return (
            <div
              key={day.toISOString()}
              className={cn(
                'flex min-h-[96px] flex-col gap-1 border-b border-r border-border-default p-1.5 last:border-r-0',
                !inMonth && 'bg-surface-overlay/30',
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full text-[11px]',
                  isToday(day) ? 'bg-accent text-ink-950 font-medium' : inMonth ? 'text-text-secondary' : 'text-text-tertiary',
                )}
              >
                {format(day, 'd')}
              </span>
              <div className="flex flex-col gap-1">
                {dayTasks.slice(0, 3).map((task) => (
                  <button
                    key={task.id}
                    onClick={() => onTaskClick(task)}
                    className="flex items-center gap-1.5 rounded-md bg-surface px-1.5 py-1 text-left text-[10px] text-text-secondary hover:bg-surface-overlay"
                  >
                    <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', PRIORITY_DOT[task.priority])} />
                    <span className="truncate">{task.title}</span>
                  </button>
                ))}
                {dayTasks.length > 3 && <span className="px-1.5 text-[10px] text-text-tertiary">+{dayTasks.length - 3} more</span>}
              </div>
            </div>
          );
        })}
      </div>
      </div>
      </div>
    </div>
  );
}
