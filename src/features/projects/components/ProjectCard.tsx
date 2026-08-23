import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Flag } from 'lucide-react';
import type { Project } from '@/types';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AvatarStack } from '@/components/ui/AvatarStack';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { HealthIndicator } from '@/components/shared/HealthIndicator';
import { getUserById } from '@/mock-data';
import { formatDueDate } from '@/lib/format';
import { fadeUp } from '@/lib/motion';

export function ProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate();
  const members = project.memberIds.map(getUserById).filter((u): u is NonNullable<typeof u> => Boolean(u));
  const nextMilestone = project.milestones.find((m) => !m.completed);

  return (
    <motion.div variants={fadeUp}>
      <Card
        interactive
        onClick={() => navigate(`/app/projects/${project.id}`)}
        className="flex h-full cursor-pointer flex-col p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: project.accent }} />
            <h3 className="truncate text-sm font-medium text-text-primary">{project.name}</h3>
          </div>
          <StatusBadge status={project.status} />
        </div>

        <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-text-tertiary">{project.description}</p>

        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] text-text-tertiary">
            <span>Progress</span>
            <span className="font-mono text-text-secondary">{project.progress}%</span>
          </div>
          <ProgressBar value={project.progress} className="mt-1.5" />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-text-tertiary">
          <HealthIndicator health={project.health} />
          <span className="inline-flex items-center gap-1">
            <Calendar size={11} />
            {formatDueDate(project.deadline)}
          </span>
          {nextMilestone && (
            <span className="inline-flex items-center gap-1 truncate">
              <Flag size={11} />
              {nextMilestone.title}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border-default pt-4">
          <AvatarStack users={members} max={4} size="xs" />
          <span className="text-[11px] font-medium capitalize text-text-tertiary">{project.priority}</span>
        </div>
      </Card>
    </motion.div>
  );
}
