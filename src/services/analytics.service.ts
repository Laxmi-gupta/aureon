import type { AnalyticsSnapshot } from '@/types';
import { approvals } from '@/mock-data';
import { users } from '@/mock-data';
import { withLatency } from './latency';
import { projectsService } from './projects.service';
import { tasksService } from './tasks.service';

export interface AnalyticsService {
  getSnapshot(): Promise<AnalyticsSnapshot>;
}

const WEEK_LABELS = ['Wk -7', 'Wk -6', 'Wk -5', 'Wk -4', 'Wk -3', 'Wk -2', 'Wk -1', 'This wk'];

function daysBetween(a: string, b: string): number {
  return Math.abs(new Date(a).getTime() - new Date(b).getTime()) / (1000 * 60 * 60 * 24);
}

async function computeSnapshot(): Promise<AnalyticsSnapshot> {
  const [projects, tasks] = await Promise.all([projectsService.list(), tasksService.list()]);

  const completedProjects = projects.filter((p) => p.status === 'completed').length;
  const projectCompletionRate = projects.length ? Math.round((completedProjects / projects.length) * 100) : 0;

  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const taskCompletionRate = tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const avgTaskDurationDays = completedTasks.length
    ? Number(
        (
          completedTasks.reduce((sum, t) => sum + daysBetween(t.createdAt, t.updatedAt), 0) / completedTasks.length
        ).toFixed(1),
      )
    : 0;

  const overdueCount = tasks.filter((t) => t.status !== 'completed' && new Date(t.dueDate).getTime() < Date.now()).length;

  const resolvedApprovals = approvals.filter((a) => a.status === 'approved' || a.status === 'rejected');
  const avgApprovalHours = resolvedApprovals.length
    ? resolvedApprovals.reduce((sum, a) => {
        const lastEntry = a.history[a.history.length - 1];
        const resolvedAt = lastEntry ? lastEntry.timestamp : a.requestedAt;
        return sum + Math.abs(new Date(resolvedAt).getTime() - new Date(a.requestedAt).getTime()) / 36e5;
      }, 0) / resolvedApprovals.length
    : 24;
  const workflowEfficiency = Math.max(40, Math.min(98, Math.round(100 - avgApprovalHours * 1.4)));

  const taskStatusBreakdown = ['planned', 'in-progress', 'review', 'completed'].map((status) => ({
    status,
    value: tasks.filter((t) => t.status === status).length,
  }));

  const workloadByMember = [...users]
    .sort((a, b) => b.workload - a.workload)
    .slice(0, 8)
    .map((u) => ({ userId: u.id, value: u.workload }));

  const completionTrend = WEEK_LABELS.map((label, index) => ({
    label,
    value: Math.round(38 + index * 6.5 + Math.sin(index * 1.3) * 6),
  }));

  const throughputByWeek = WEEK_LABELS.map((label, index) => ({
    label,
    value: Math.round(14 + index * 2.2 + Math.cos(index) * 3),
  }));

  return {
    projectCompletionRate,
    taskCompletionRate,
    avgTaskDurationDays,
    overdueCount,
    workflowEfficiency,
    completionTrend,
    workloadByMember,
    taskStatusBreakdown,
    throughputByWeek,
  };
}

class MockAnalyticsService implements AnalyticsService {
  async getSnapshot(): Promise<AnalyticsSnapshot> {
    const snapshot = await computeSnapshot();
    return withLatency(snapshot, 450);
  }
}

export const analyticsService: AnalyticsService = new MockAnalyticsService();
