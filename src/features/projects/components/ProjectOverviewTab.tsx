import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { Project } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { RadialProgress } from '@/components/shared/RadialProgress';
import { HealthIndicator } from '@/components/shared/HealthIndicator';
import { formatDate, formatDueDate } from '@/lib/format';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/cn';

export function ProjectOverviewTab({ project }: { project: Project }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardContent>
          <h3 className="text-sm font-medium text-text-primary">About this project</h3>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">{project.description}</p>

          {project.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-surface-overlay px-2.5 py-1 text-[11px] text-text-tertiary">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h3 className="mt-6 text-sm font-medium text-text-primary">Milestones</h3>
          <motion.ul variants={staggerContainer(0.06)} initial="hidden" animate="visible" className="mt-3 flex flex-col gap-1">
            {project.milestones.map((milestone) => (
              <motion.li key={milestone.id} variants={fadeUp} className="flex items-center gap-3 rounded-lg px-1 py-2">
                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                    milestone.completed ? 'border-success-500 bg-success-500 text-ink-950' : 'border-border-strong text-transparent',
                  )}
                >
                  <Check size={11} strokeWidth={3} />
                </span>
                <span className={cn('flex-1 text-sm', milestone.completed ? 'text-text-tertiary line-through' : 'text-text-primary')}>
                  {milestone.title}
                </span>
                <span className="text-xs text-text-tertiary">{formatDueDate(milestone.dueDate)}</span>
              </motion.li>
            ))}
          </motion.ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <RadialProgress value={project.progress} size={64} strokeWidth={5} label={`${project.progress}%`} />
            <div>
              <p className="text-sm font-medium text-text-primary">On schedule</p>
              <HealthIndicator health={project.health} className="mt-1" />
            </div>
          </div>

          <dl className="flex flex-col gap-3 border-t border-border-default pt-4 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-text-tertiary">Start date</dt>
              <dd className="text-text-primary">{formatDate(project.startDate)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-text-tertiary">Deadline</dt>
              <dd className="text-text-primary">{formatDate(project.deadline)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-text-tertiary">Priority</dt>
              <dd className="capitalize text-text-primary">{project.priority}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-text-tertiary">Team size</dt>
              <dd className="text-text-primary">{project.memberIds.length} members</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
