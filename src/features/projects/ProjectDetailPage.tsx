import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, FolderKanban } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { AvatarStack } from '@/components/ui/AvatarStack';
import { ProjectOverviewTab } from './components/ProjectOverviewTab';
import { ProjectTasksTab } from './components/ProjectTasksTab';
import { ProjectTimelineTab } from './components/ProjectTimelineTab';
import { ProjectTeamTab } from './components/ProjectTeamTab';
import { ProjectFilesTab } from './components/ProjectFilesTab';
import { ProjectActivityTab } from './components/ProjectActivityTab';
import { projectsService, tasksService, teamService, activityService } from '@/services';

export function ProjectDetailPage() {
  const { projectId } = useParams();

  const { data: projects = [], isLoading: projectsLoading } = useQuery({ queryKey: ['projects'], queryFn: projectsService.list });
  const { data: allTasks = [] } = useQuery({ queryKey: ['tasks'], queryFn: tasksService.list });
  const { data: allUsers = [] } = useQuery({ queryKey: ['users'], queryFn: teamService.list });
  const { data: allActivity = [] } = useQuery({ queryKey: ['activity'], queryFn: activityService.list });

  const project = projects.find((p) => p.id === projectId);

  if (projectsLoading) {
    return (
      <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (!project) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="Project not found"
        description="This project may have been removed."
        action={
          <Link to="/app/projects" className="mt-2 text-sm font-medium text-accent hover:text-accent-strong">
            Back to projects
          </Link>
        }
      />
    );
  }

  const tasks = allTasks.filter((t) => t.projectId === project.id);
  const members = project.memberIds.map((id) => allUsers.find((u) => u.id === id)).filter((u): u is NonNullable<typeof u> => Boolean(u));
  const events = allActivity.filter((e) => e.targetLabel === project.name);

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
      <Link to="/app/projects" className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-text-tertiary hover:text-text-primary">
        <ArrowLeft size={13} />
        All projects
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: project.accent }} />
            <h1 className="text-2xl font-medium tracking-tight text-text-primary">{project.name}</h1>
            <StatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
          </div>
          <p className="mt-2 max-w-xl text-sm text-text-tertiary">{project.description}</p>
        </div>
        <AvatarStack users={members} max={5} size="sm" />
      </div>

      <Tabs defaultValue="overview">
        <div className="overflow-x-auto">
          <TabsList className="w-max">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-5">
          <ProjectOverviewTab project={project} />
        </TabsContent>
        <TabsContent value="tasks" className="mt-5">
          <ProjectTasksTab tasks={tasks} />
        </TabsContent>
        <TabsContent value="timeline" className="mt-5">
          <ProjectTimelineTab project={project} />
        </TabsContent>
        <TabsContent value="team" className="mt-5">
          <ProjectTeamTab members={members} ownerId={project.ownerId} />
        </TabsContent>
        <TabsContent value="files" className="mt-5">
          <ProjectFilesTab />
        </TabsContent>
        <TabsContent value="activity" className="mt-5">
          <ProjectActivityTab events={events} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
