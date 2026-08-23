import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Clock, FolderKanban, Zap } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { StatTile } from '@/components/shared/StatTile';
import { PageHeader } from '@/components/shared/PageHeader';
import { ChartCard } from './components/ChartCard';
import { CompletionTrendChart } from './components/CompletionTrendChart';
import { ThroughputChart } from './components/ThroughputChart';
import { TaskStatusBreakdownChart } from './components/TaskStatusBreakdownChart';
import { WorkloadBreakdownChart } from './components/WorkloadBreakdownChart';
import { analyticsService } from '@/services';
import { staggerContainer } from '@/lib/motion';

export function AnalyticsPage() {
  const { data: snapshot, isLoading } = useQuery({ queryKey: ['analytics'], queryFn: analyticsService.getSnapshot });

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <PageHeader title="Analytics" description="How work is actually moving across the org" />

      {isLoading || !snapshot ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-[104px] rounded-2xl" />
          ))}
        </div>
      ) : (
        <motion.div variants={staggerContainer(0.06)} initial="hidden" animate="visible" className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <StatTile label="Project completion" value={snapshot.projectCompletionRate} suffix="%" icon={FolderKanban} tone="gold" />
          <StatTile label="Task completion" value={snapshot.taskCompletionRate} suffix="%" icon={CheckCircle2} />
          <StatTile label="Avg. task duration" value={snapshot.avgTaskDurationDays} suffix="d" icon={Clock} />
          <StatTile label="Overdue work" value={snapshot.overdueCount} icon={AlertTriangle} trend={{ value: 6, positive: false }} />
          <StatTile label="Workflow efficiency" value={snapshot.workflowEfficiency} suffix="%" icon={Zap} trend={{ value: 5, positive: true }} />
        </motion.div>
      )}

      {isLoading || !snapshot ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Skeleton className="h-[320px] rounded-2xl lg:col-span-2" />
          <Skeleton className="h-[320px] rounded-2xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <ChartCard title="Completion trend" subtitle="Tasks completed per week" className="lg:col-span-2">
            <CompletionTrendChart data={snapshot.completionTrend} />
          </ChartCard>
          <ChartCard title="Task breakdown" subtitle="Current distribution by status">
            <TaskStatusBreakdownChart data={snapshot.taskStatusBreakdown} />
          </ChartCard>
        </div>
      )}

      {isLoading || !snapshot ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Skeleton className="h-[320px] rounded-2xl" />
          <Skeleton className="h-[320px] rounded-2xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <ChartCard title="Team workload" subtitle="Current capacity by member">
            <WorkloadBreakdownChart data={snapshot.workloadByMember} />
          </ChartCard>
          <ChartCard title="Throughput" subtitle="Tasks shipped per week">
            <ThroughputChart data={snapshot.throughputByWeek} />
          </ChartCard>
        </div>
      )}
    </div>
  );
}
