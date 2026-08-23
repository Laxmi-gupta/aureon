import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Bell, CheckCircle2, TrendingUp } from 'lucide-react';
import { AvatarStack } from '@/components/ui/AvatarStack';
import { users } from '@/mock-data';
import { transition } from '@/lib/motion';

const boardMembers = users.slice(1, 5);

const loop = (duration: number, delay = 0) => ({
  repeat: Infinity,
  repeatType: 'mirror' as const,
  duration,
  delay,
  ease: [0.45, 0, 0.55, 1] as const,
});

export function HeroVisual() {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), { stiffness: 150, damping: 20 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div className="relative mx-auto h-[420px] w-full max-w-[560px] sm:h-[480px] lg:h-[560px]">
      {/* Ambient glow */}
      <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/20 blur-[110px]" />
      <div className="absolute -left-10 bottom-0 h-64 w-64 rounded-full bg-info-500/10 blur-[100px]" />

      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative h-full w-full"
        style={{ perspective: 1400 }}
      >
        <motion.div
          style={prefersReducedMotion ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="relative h-full w-full"
        >
          {/* Primary panel — project card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition.slow, delay: 0.3 }}
            className="absolute left-1/2 top-1/2 w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-ink-600 bg-ink-850/90 p-5 shadow-raised backdrop-blur-xl sm:w-[330px]"
            style={{ transform: 'translateZ(40px)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-ink-300">Project</p>
                <p className="mt-0.5 text-sm font-medium text-ink-50">Project Aurora</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-success-500/30 bg-success-500/10 px-2 py-1 text-[10px] font-medium text-success-400">
                On track
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] text-ink-300">
                <span>Progress</span>
                <span className="font-mono text-ink-100">74%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '74%' }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                  className="h-full rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-300"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <AvatarStack users={boardMembers} size="xs" max={4} />
              <div className="flex items-center gap-1 text-[11px] text-success-400">
                <TrendingUp size={12} />
                +12% this week
              </div>
            </div>
          </motion.div>

          {/* Kanban strip — tasks moving through stages */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...transition.slow, delay: 0.5 }}
            className="absolute left-0 top-6 hidden w-[200px] rounded-xl border border-ink-600 bg-ink-850/90 p-3.5 shadow-card backdrop-blur-xl sm:block"
            style={{ transform: 'translateZ(70px)' }}
          >
            <p className="mb-2.5 text-[10px] font-medium uppercase tracking-wide text-ink-300">In Review</p>
            <motion.div
              animate={prefersReducedMotion ? undefined : { y: [0, -6, 0] }}
              transition={prefersReducedMotion ? undefined : loop(3.2)}
              className="rounded-lg border border-ink-600 bg-ink-800 p-2.5"
            >
              <p className="text-[11px] font-medium text-ink-50">Audit color contrast</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="rounded-full bg-warning-500/15 px-1.5 py-0.5 text-[9px] text-warning-400">High</span>
                <span className="h-4 w-4 rounded-full bg-gold-500" />
              </div>
            </motion.div>
          </motion.div>

          {/* Approval request card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={
              prefersReducedMotion
                ? { opacity: 1, y: 0 }
                : { opacity: [0, 1, 1, 0], y: [18, 0, 0, -6] }
            }
            transition={
              prefersReducedMotion
                ? { ...transition.slow, delay: 0.8 }
                : { duration: 4.5, times: [0, 0.18, 0.82, 1], repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }
            }
            className="absolute -right-2 top-2 hidden w-[220px] rounded-xl border border-ink-600 bg-ink-850/95 p-3.5 shadow-raised backdrop-blur-xl md:block"
            style={{ transform: 'translateZ(90px)' }}
          >
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-500/15 text-gold-400">
                <CheckCircle2 size={14} />
              </span>
              <div>
                <p className="text-[11px] font-medium text-ink-50">Approval requested</p>
                <p className="text-[10px] text-ink-300">Purchase · $2,899</p>
              </div>
            </div>
          </motion.div>

          {/* Notification toast */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={
              prefersReducedMotion
                ? { opacity: 1, x: 0 }
                : { opacity: [0, 1, 1, 0], x: [16, 0, 0, 8] }
            }
            transition={
              prefersReducedMotion
                ? { ...transition.slow, delay: 1.1 }
                : { duration: 4.5, times: [0, 0.18, 0.82, 1], repeat: Infinity, repeatDelay: 2, delay: 1.6, ease: 'easeInOut' }
            }
            className="absolute bottom-10 right-0 hidden w-[210px] rounded-xl border border-ink-600 bg-ink-850/95 p-3 shadow-card backdrop-blur-xl sm:block"
            style={{ transform: 'translateZ(60px)' }}
          >
            <div className="flex items-start gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-info-500/15 text-info-400">
                <Bell size={12} />
              </span>
              <p className="text-[11px] leading-snug text-ink-200">
                <span className="font-medium text-ink-50">Sarah</span> completed Design Review
              </p>
            </div>
          </motion.div>

          {/* Floating stat chip */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition.slow, delay: 0.7 }}
            className="absolute bottom-2 left-4 hidden rounded-xl border border-ink-600 bg-ink-850/90 px-3.5 py-2.5 shadow-card backdrop-blur-xl md:block"
            style={{ transform: 'translateZ(50px)' }}
          >
            <motion.div
              animate={prefersReducedMotion ? undefined : { y: [0, -5, 0] }}
              transition={prefersReducedMotion ? undefined : loop(3.6, 0.5)}
              className="flex items-center gap-2"
            >
              <ArrowUpRight size={13} className="text-success-400" />
              <div>
                <p className="text-[10px] text-ink-300">Workflow efficiency</p>
                <p className="font-mono text-xs text-ink-50">94%</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
