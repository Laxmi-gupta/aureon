import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, FolderKanban } from 'lucide-react';
import type { Project } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { RadialProgress } from '@/components/shared/RadialProgress';
import { HealthIndicator } from '@/components/shared/HealthIndicator';
import { AvatarStack } from '@/components/ui/AvatarStack';
import { EmptyState } from '@/components/ui/EmptyState';
import { getUserById } from '@/mock-data';
import { formatDueDate } from '@/lib/format';
import { fadeUp, staggerContainer } from '@/lib/motion';

export function ProjectHealthList({ projects }: { projects: Project[] }) {
  const navigate = useNavigate();
  const active = projects.filter((p) => p.status !== 'completed').slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <div>
          <h3 className="text-sm font-medium text-text-primary">Project health</h3>
          <p className="mt-0.5 text-xs text-text-tertiary">Progress and risk across active projects</p>
        </div>
      </CardHeader>
      <CardContent>
        {active.length === 0 ? (
          <EmptyState icon={FolderKanban} title="No active projects" description="Create a project to see health here." />
        ) : (
          <motion.div variants={staggerContainer(0.06)} initial="hidden" animate="visible" className="flex flex-col gap-1">
            {active.map((project) => {
              const owner = getUserById(project.ownerId);
              const members = project.memberIds.map(getUserById).filter((u): u is NonNullable<typeof u> => Boolean(u));
              return (
                <motion.button
                  key={project.id}
                  variants={fadeUp}
                  onClick={() => navigate(`/app/projects/${project.id}`)}
                  className="flex items-center gap-4 rounded-xl p-3 text-left transition-colors hover:bg-surface-overlay"
                >
                  <RadialProgress value={project.progress} size={44} strokeWidth={4} label={`${project.progress}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: project.accent }} />
                      <p className="truncate text-sm font-medium text-text-primary">{project.name}</p>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-text-tertiary">
                      <HealthIndicator health={project.health} />
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={11} />
                        {formatDueDate(project.deadline)}
                      </span>
                      <span className="hidden sm:inline">Owner {owner?.name.split(' ')[0]}</span>
                    </div>
                  </div>
                  <AvatarStack users={members} max={3} size="xs" className="hidden sm:flex" />
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
