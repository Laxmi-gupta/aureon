import { motion } from 'framer-motion';
import { isToday } from 'date-fns';
import { CheckCircle2, FolderKanban, Gauge, ListTodo } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ActivityFeed } from '@/components/shared/ActivityFeed';
import { StatTile } from '@/components/shared/StatTile';
import { ProjectHealthList } from './components/ProjectHealthList';
import { UpcomingDeadlines } from './components/UpcomingDeadlines';
import { WorkloadPanel } from './components/WorkloadPanel';
import { MyTasksPanel } from './components/MyTasksPanel';
import { useDashboardData } from './useDashboardData';
import { useAuthStore } from '@/store/auth.store';
import { staggerContainer } from '@/lib/motion';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function OverviewPage() {
  const session = useAuthStore((s) => s.session);
  const { projects, tasks, approvals, users, activity, isLoading } = useDashboardData();

  const activeProjects = projects.filter((p) => p.status === 'active').length;
  const tasksDueToday = tasks.filter((t) => t.status !== 'completed' && isToday(new Date(t.dueDate))).length;
  const pendingApprovals = approvals.filter((a) => a.status === 'pending').length;
  const avgCapacity = users.length ? Math.round(users.reduce((sum, u) => sum + u.workload, 0) / users.length) : 0;

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-text-primary">
          {greeting()}
          {session?.user ? `, ${session.user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="mt-1 text-sm text-text-tertiary">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} — here's where
          things stand.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[104px] rounded-2xl" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={staggerContainer(0.07)}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          <StatTile label="Active projects" value={activeProjects} icon={FolderKanban} tone="gold" trend={{ value: 8, positive: true }} />
          <StatTile label="Tasks due today" value={tasksDueToday} icon={ListTodo} trend={{ value: 3, positive: false }} />
          <StatTile label="Pending approvals" value={pendingApprovals} icon={CheckCircle2} trend={{ value: 12, positive: true }} />
          <StatTile label="Avg. team capacity" value={avgCapacity} suffix="%" icon={Gauge} trend={{ value: 4, positive: true }} />
        </motion.div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Skeleton className="h-[360px] rounded-2xl lg:col-span-2" />
          <Skeleton className="h-[360px] rounded-2xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ProjectHealthList projects={projects} />
          </div>
          <UpcomingDeadlines tasks={tasks} projects={projects} />
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Skeleton className="h-[300px] rounded-2xl" />
          <Skeleton className="h-[300px] rounded-2xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <MyTasksPanel tasks={tasks} userId={session?.user?.id} />
          <WorkloadPanel users={users} />
        </div>
      )}

      {isLoading ? (
        <Skeleton className="h-[320px] rounded-2xl" />
      ) : (
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-sm font-medium text-text-primary">Recent activity</h3>
              <p className="mt-0.5 text-xs text-text-tertiary">What's moved across the team</p>
            </div>
          </CardHeader>
          <CardContent className="pt-3">
            <ActivityFeed events={activity} limit={10} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
