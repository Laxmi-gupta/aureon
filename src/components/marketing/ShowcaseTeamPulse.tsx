import { motion } from 'framer-motion';
import { Container } from './Container';
import { SectionHeading } from './SectionHeading';
import { Avatar } from '@/components/ui/Avatar';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { users } from '@/mock-data';
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';

const roster = [...users].sort((a, b) => b.workload - a.workload).slice(0, 6);

const STATS = [
  { label: 'Active collaborators', value: users.length, suffix: '' },
  { label: 'Avg. team capacity', value: 68, suffix: '%' },
  { label: 'Tasks completed / wk', value: 47, suffix: '' },
];

function toneFor(workload: number) {
  if (workload >= 85) return 'bg-danger-500';
  if (workload >= 65) return 'bg-gold-500';
  return 'bg-success-500';
}

export function ShowcaseTeamPulse() {
  return (
    <section className="border-t border-ink-800 bg-ink-950 py-24 sm:py-32">
      <Container className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-10">
        <div>
          <SectionHeading
            eyebrow="Team Pulse"
            title="See workload before it becomes burnout."
            description="Capacity, activity, and output at a glance — so managers can rebalance work before it's a problem, not after."
          />

          <div className="mt-10 grid grid-cols-3 gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-ink-700 bg-ink-900/40 p-4">
                <p className="font-mono text-2xl font-medium text-ink-50">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-[11px] leading-snug text-ink-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex flex-col gap-3.5 rounded-2xl border border-ink-700 bg-ink-900/40 p-6"
        >
          {roster.map((member) => (
            <motion.div key={member.id} variants={fadeUp} className="flex items-center gap-3">
              <Avatar name={member.name} color={member.color} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="truncate font-medium text-ink-100">{member.name}</span>
                  <span className="font-mono text-ink-400">{member.workload}%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${member.workload}%` }}
                    viewport={viewportOnce}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className={`h-full rounded-full ${toneFor(member.workload)}`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
