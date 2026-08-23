import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { Container } from './Container';
import { SectionHeading } from './SectionHeading';
import { RadialProgress } from '@/components/shared/RadialProgress';
import { AvatarStack } from '@/components/ui/AvatarStack';
import { HealthIndicator } from '@/components/shared/HealthIndicator';
import { projects, getUserById } from '@/mock-data';
import { formatDueDate } from '@/lib/format';
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';

const featured = projects.slice(0, 3);

export function ShowcaseProjectIntelligence() {
  return (
    <section className="border-t border-ink-800 bg-ink-950 py-24 sm:py-32">
      <Container className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
        <SectionHeading
          eyebrow="Project Intelligence"
          title="Know exactly where every project stands."
          description="Progress, health, deadlines, and ownership — surfaced automatically, not chased down in status meetings."
        />

        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex flex-col gap-3"
        >
          {featured.map((project) => {
            const owner = getUserById(project.ownerId);
            const members = project.memberIds.map(getUserById).filter((u): u is NonNullable<typeof u> => Boolean(u));
            return (
              <motion.div
                key={project.id}
                variants={fadeUp}
                className="flex items-center gap-5 rounded-2xl border border-ink-700 bg-ink-900/60 p-5 transition-colors hover:border-ink-500"
              >
                <RadialProgress value={project.progress} size={52} strokeWidth={4} label={`${project.progress}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: project.accent }} />
                    <p className="truncate text-sm font-medium text-ink-50">{project.name}</p>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-400">
                    <HealthIndicator health={project.health} />
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={11} />
                      Due {formatDueDate(project.deadline)}
                    </span>
                    <span>Owner {owner?.name.split(' ')[0]}</span>
                  </div>
                </div>
                <AvatarStack users={members} max={3} size="xs" />
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
