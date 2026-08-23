import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Container } from './Container';
import { HeroVisual } from './HeroVisual';
import { transition } from '@/lib/motion';

const lineVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { ...transition.slow, delay },
  }),
};

export function Hero() {
  const navigate = useNavigate();

  const scrollToProduct = () => {
    document.querySelector('#solutions')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="product" className="relative overflow-hidden bg-ink-950 pb-24 pt-40 sm:pb-32 sm:pt-48">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, black 40%, transparent 90%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-gold-500/10 blur-[140px]"
      />

      <Container className="relative grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition.base}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-ink-600 bg-ink-900/80 px-3.5 py-1.5 text-xs font-medium text-ink-200"
          >
            <Sparkles size={12} className="text-gold-400" />
            Business Operations Platform
          </motion.div>

          <h1 className="text-[2.6rem] font-medium leading-[1.06] tracking-tight text-ink-50 sm:text-6xl lg:text-[4rem]">
            <motion.span custom={0.1} variants={lineVariants} initial="hidden" animate="visible" className="block">
              Work has momentum.
            </motion.span>
            <motion.span custom={0.25} variants={lineVariants} initial="hidden" animate="visible" className="block">
              Aureon gives it{' '}
              <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 bg-clip-text font-serif italic text-transparent">
                direction.
              </span>
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition.slow, delay: 0.45 }}
            className="mt-7 max-w-lg text-base leading-relaxed text-ink-300 sm:text-lg"
          >
            Projects, people, workflows, and decisions — connected in one intelligent workspace.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition.slow, delay: 0.58 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() => navigate('/app')}
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-gold-500 px-6 text-sm font-medium text-ink-950 transition-colors hover:bg-gold-400"
            >
              Explore Aureon
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={scrollToProduct}
              className="inline-flex h-12 items-center rounded-full border border-ink-600 px-6 text-sm font-medium text-ink-100 transition-colors hover:border-ink-400 hover:bg-ink-900"
            >
              View Platform
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...transition.slow, delay: 0.75 }}
            className="mt-14 flex items-center gap-8 text-ink-400"
          >
            <p className="text-[11px] uppercase tracking-[0.16em]">Built for modern operating teams</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...transition.slow, delay: 0.3 }}
        >
          <HeroVisual />
        </motion.div>
      </Container>
    </section>
  );
}
