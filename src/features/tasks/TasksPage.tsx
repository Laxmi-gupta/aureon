import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, Kanban, ListChecks, Plus, Search, UserRound } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageHeader } from '@/components/shared/PageHeader';
import { tasksService, projectsService } from '@/services';
import { useAuthStore } from '@/store/auth.store';
import { MyTasksView } from './components/MyTasksView';
import { KanbanBoard } from './components/KanbanBoard';
import { TaskListView } from './components/TaskListView';
import { TaskCalendarView } from './components/TaskCalendarView';
import { TaskFormDialog } from './components/TaskFormDialog';
import { cn } from '@/lib/cn';
import type { Priority, Task } from '@/types';

type ViewMode = 'my' | 'kanban' | 'list' | 'calendar';

const VIEWS: { key: ViewMode; label: string; icon: typeof ListChecks }[] = [
  { key: 'my', label: 'My Tasks', icon: UserRound },
  { key: 'kanban', label: 'Kanban', icon: Kanban },
  { key: 'list', label: 'List', icon: ListChecks },
  { key: 'calendar', label: 'Calendar', icon: CalendarDays },
];

export function TasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const session = useAuthStore((s) => s.session);
  const [view, setView] = useState<ViewMode>('my');
  const [search, setSearch] = useState('');
  const [projectId, setProjectId] = useState('all');
  const [priority, setPriority] = useState<Priority | 'all'>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const { data: tasks = [], isLoading } = useQuery({ queryKey: ['tasks'], queryFn: tasksService.list });
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: projectsService.list });

  useEffect(() => {
    if (searchParams.get('create') === 'task') {
      setEditingTask(undefined);
      setFormOpen(true);
      searchParams.delete('create');
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return tasks.filter((task) => {
      if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (projectId !== 'all' && task.projectId !== projectId) return false;
      if (priority !== 'all' && task.priority !== priority) return false;
      return true;
    });
  }, [tasks, search, projectId, priority]);

  const myTasks = filtered.filter((t) => t.assigneeId === session?.user?.id);

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const openCreate = () => {
    setEditingTask(undefined);
    setFormOpen(true);
  };

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <PageHeader
        title="Tasks"
        description="Plan, assign, and track work across every project"
        action={
          <Button onClick={openCreate} icon={<Plus size={15} />}>
            New task
          </Button>
        }
      />

      <div className="flex items-center gap-1 self-start overflow-x-auto rounded-full border border-border-default bg-surface-raised p-1">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            onClick={() => setView(v.key)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors',
              view === v.key ? 'bg-accent text-ink-950' : 'text-text-tertiary hover:text-text-primary',
            )}
          >
            <v.icon size={13} />
            {v.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search tasks…"
          icon={<Search size={14} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={projectId} onValueChange={setProjectId}>
          <SelectTrigger className="sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priority} onValueChange={(v) => setPriority(v as Priority | 'all')}>
          <SelectTrigger className="sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Skeleton className="h-[420px] rounded-2xl" />
      ) : (
        <>
          {view === 'my' && <MyTasksView tasks={myTasks} onEdit={openEdit} />}
          {view === 'kanban' && <KanbanBoard tasks={filtered} onTaskClick={openEdit} />}
          {view === 'list' && <TaskListView tasks={filtered} onTaskClick={openEdit} />}
          {view === 'calendar' && <TaskCalendarView tasks={filtered} onTaskClick={openEdit} />}
        </>
      )}

      <TaskFormDialog open={formOpen} onOpenChange={setFormOpen} task={editingTask} />
    </div>
  );
}
