import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Container } from './Container';
import { fadeUp, viewportOnce } from '@/lib/motion';

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden border-t border-ink-800 bg-ink-950 py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/10 blur-[130px]"
      />
      <Container className="relative">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-medium leading-tight tracking-tight text-ink-50 sm:text-4xl">
            Give your team's work somewhere to <span className="font-serif italic text-gold-400">go.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-ink-300">
            Explore the full Aureon workspace — projects, workflows, and approvals, all connected.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/app')}
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-gold-500 px-6 text-sm font-medium text-ink-950 transition-colors hover:bg-gold-400"
            >
              Explore Aureon
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex h-12 items-center rounded-full border border-ink-600 px-6 text-sm font-medium text-ink-100 transition-colors hover:border-ink-400 hover:bg-ink-900"
            >
              Login
            </button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
