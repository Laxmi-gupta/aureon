import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Project } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AvatarStack } from '@/components/ui/AvatarStack';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { HealthIndicator } from '@/components/shared/HealthIndicator';
import { getUserById } from '@/mock-data';
import { formatDueDate } from '@/lib/format';
import { fadeUp } from '@/lib/motion';

export function ProjectListRow({ project }: { project: Project }) {
  const navigate = useNavigate();
  const members = project.memberIds.map(getUserById).filter((u): u is NonNullable<typeof u> => Boolean(u));

  return (
    <motion.tr
      variants={fadeUp}
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/app/projects/${project.id}`)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          navigate(`/app/projects/${project.id}`);
        }
      }}
      className="cursor-pointer border-b border-border-default transition-colors last:border-0 hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
    >
      <td className="py-3.5 pl-4 pr-3">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: project.accent }} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text-primary">{project.name}</p>
            <p className="truncate text-xs text-text-tertiary">{project.description}</p>
          </div>
        </div>
      </td>
      <td className="px-3 py-3.5">
        <StatusBadge status={project.status} />
      </td>
      <td className="px-3 py-3.5">
        <PriorityBadge priority={project.priority} />
      </td>
      <td className="px-3 py-3.5">
        <HealthIndicator health={project.health} />
      </td>
      <td className="w-36 px-3 py-3.5">
        <div className="flex items-center gap-2">
          <ProgressBar value={project.progress} className="w-20" />
          <span className="font-mono text-[11px] text-text-tertiary">{project.progress}%</span>
        </div>
      </td>
      <td className="px-3 py-3.5 text-xs text-text-tertiary">{formatDueDate(project.deadline)}</td>
      <td className="px-3 py-3.5 pr-4">
        <AvatarStack users={members} max={3} size="xs" />
      </td>
    </motion.tr>
  );
}
