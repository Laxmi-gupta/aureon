import { motion } from 'framer-motion';
import { Compass, Layers, Zap } from 'lucide-react';
import { Container } from './Container';
import { SectionHeading } from './SectionHeading';
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';

const PRINCIPLES = [
  {
    icon: Layers,
    title: 'Built for clarity',
    description: 'One shared source of truth for projects, tasks, and decisions — not six disconnected tools.',
  },
  {
    icon: Zap,
    title: 'Designed to move fast',
    description: 'Every interaction is built to reduce friction, from approvals to reporting.',
  },
  {
    icon: Compass,
    title: 'Made for real teams',
    description: 'Workflows model how operations teams actually make decisions, not a generic template.',
  },
];

export function AboutSection() {
  return (
    <section id="about" className="border-t border-ink-800 bg-ink-950 py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="About Aureon"
          title="We build the operating layer for how businesses run."
          description="Aureon exists because operations work is still scattered across messages, spreadsheets, and inboxes. We think the system of record for how work happens deserves the same care as the tools teams use to build the product itself."
          align="center"
          className="mx-auto"
        />

        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-14 grid gap-6 sm:grid-cols-3"
        >
          {PRINCIPLES.map((principle) => (
            <motion.div key={principle.title} variants={fadeUp} className="rounded-2xl border border-ink-700 bg-ink-900/40 p-6 text-center">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 text-gold-400">
                <principle.icon size={17} strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 text-sm font-medium text-ink-50">{principle.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-400">{principle.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
