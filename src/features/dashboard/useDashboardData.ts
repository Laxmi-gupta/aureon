import { useQuery } from '@tanstack/react-query';
import { activityService, analyticsService, approvalsService, projectsService, tasksService, teamService } from '@/services';

export function useDashboardData() {
  const projects = useQuery({ queryKey: ['projects'], queryFn: projectsService.list });
  const tasks = useQuery({ queryKey: ['tasks'], queryFn: tasksService.list });
  const approvals = useQuery({ queryKey: ['approvals'], queryFn: approvalsService.list });
  const users = useQuery({ queryKey: ['users'], queryFn: teamService.list });
  const activity = useQuery({ queryKey: ['activity'], queryFn: activityService.list });
  const analytics = useQuery({ queryKey: ['analytics'], queryFn: analyticsService.getSnapshot });

  return {
    projects: projects.data ?? [],
    tasks: tasks.data ?? [],
    approvals: approvals.data ?? [],
    users: users.data ?? [],
    activity: activity.data ?? [],
    analytics: analytics.data,
    isLoading: projects.isLoading || tasks.isLoading || approvals.isLoading || users.isLoading || activity.isLoading,
  };
}
