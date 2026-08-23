import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FolderKanban, LayoutGrid, List, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageHeader } from '@/components/shared/PageHeader';
import { ProjectCard } from './components/ProjectCard';
import { ProjectListRow } from './components/ProjectListRow';
import { CreateProjectDialog } from './components/CreateProjectDialog';
import { projectsService } from '@/services';
import { staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/cn';
import type { ProjectStatus } from '@/types';

type SortKey = 'deadline' | 'priority' | 'name' | 'progress';
const PRIORITY_WEIGHT = { urgent: 3, high: 2, medium: 1, low: 0 } as const;

export function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ProjectStatus | 'all'>('all');
  const [sort, setSort] = useState<SortKey>('deadline');
  const [createOpen, setCreateOpen] = useState(false);

  const { data: projects = [], isLoading } = useQuery({ queryKey: ['projects'], queryFn: projectsService.list });

  useEffect(() => {
    if (searchParams.get('create') === 'project') {
      setCreateOpen(true);
      searchParams.delete('create');
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    let result = projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (status !== 'all') result = result.filter((p) => p.status === status);

    return [...result].sort((a, b) => {
      if (sort === 'deadline') return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      if (sort === 'priority') return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
      if (sort === 'progress') return b.progress - a.progress;
      return a.name.localeCompare(b.name);
    });
  }, [projects, search, status, sort]);

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <PageHeader
        title="Projects"
        description={`${projects.length} projects across your workspace`}
        action={
          <Button onClick={() => setCreateOpen(true)} icon={<Plus size={15} />}>
            New project
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Search projects…"
            icon={<Search size={14} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-xs"
          />
          <Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus | 'all')}>
            <SelectTrigger className="sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on-hold">On hold</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deadline">Sort: Deadline</SelectItem>
              <SelectItem value="priority">Sort: Priority</SelectItem>
              <SelectItem value="progress">Sort: Progress</SelectItem>
              <SelectItem value="name">Sort: Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1 self-start rounded-lg border border-border-default bg-surface-raised p-1">
          <button
            onClick={() => setView('grid')}
            className={cn('flex h-7 w-7 items-center justify-center rounded-md', view === 'grid' ? 'bg-surface-overlay text-text-primary' : 'text-text-tertiary')}
            aria-label="Grid view"
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => setView('list')}
            className={cn('flex h-7 w-7 items-center justify-center rounded-md', view === 'list' ? 'bg-surface-overlay text-text-primary' : 'text-text-tertiary')}
            aria-label="List view"
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[220px] rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description="Try a different search or filter, or create a new project."
          action={
            <Button size="sm" className="mt-2" onClick={() => setCreateOpen(true)}>
              New project
            </Button>
          }
        />
      ) : view === 'grid' ? (
        <motion.div
          variants={staggerContainer(0.05)}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border-default bg-surface-raised">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border-default text-[11px] uppercase tracking-wide text-text-tertiary">
                <th className="py-3 pl-4 pr-3 font-medium">Project</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Priority</th>
                <th className="px-3 py-3 font-medium">Health</th>
                <th className="px-3 py-3 font-medium">Progress</th>
                <th className="px-3 py-3 font-medium">Deadline</th>
                <th className="px-3 py-3 pr-4 font-medium">Team</th>
              </tr>
            </thead>
            <motion.tbody variants={staggerContainer(0.04)} initial="hidden" animate="visible">
              {filtered.map((project) => (
                <ProjectListRow key={project.id} project={project} />
              ))}
            </motion.tbody>
          </table>
        </div>
      )}

      <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
