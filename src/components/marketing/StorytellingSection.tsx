import { useMemo, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { CalendarClock, FileCheck2, ListChecks, Mail, MessageSquare, Table2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { Container } from './Container';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface ScatteredItem {
  icon: LucideIcon;
  label: string;
  from: { x: number; y: number; rotate: number };
}

function ScatteredCard({
  item,
  index,
  scrollYProgress,
  prefersReducedMotion,
}: {
  item: ScatteredItem;
  index: number;
  scrollYProgress: MotionValue<number>;
  prefersReducedMotion: boolean | null;
}) {
  const range: [number, number] = [0.05 + index * 0.03, 0.5 + index * 0.02];
  const x = useTransform(scrollYProgress, range, [item.from.x, 0]);
  const y = useTransform(scrollYProgress, range, [item.from.y, 0]);
  const rotate = useTransform(scrollYProgress, range, [item.from.rotate, 0]);
  const opacity = useTransform(scrollYProgress, [range[0], range[1], range[1] + 0.15], [1, 1, 0]);
  const Icon = item.icon;

  return (
    <motion.div
      style={prefersReducedMotion ? { left: '50%', top: '50%' } : { x, y, rotate, opacity, left: '50%', top: '50%' }}
      className="absolute flex w-[132px] -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-xl border border-ink-600 bg-ink-850/90 px-3 py-2.5 shadow-card backdrop-blur-sm"
    >
      <Icon size={15} className="shrink-0 text-ink-300" />
      <span className="text-[12px] font-medium text-ink-100">{item.label}</span>
    </motion.div>
  );
}

const ITEMS: ScatteredItem[] = [
  { icon: MessageSquare, label: 'Messages', from: { x: -300, y: -150, rotate: -10 } },
  { icon: Table2, label: 'Spreadsheets', from: { x: 260, y: -190, rotate: 8 } },
  { icon: ListChecks, label: 'Tasks', from: { x: -340, y: 90, rotate: -7 } },
  { icon: Mail, label: 'Emails', from: { x: 320, y: 70, rotate: 12 } },
  { icon: FileCheck2, label: 'Approvals', from: { x: -140, y: 230, rotate: -9 } },
  { icon: CalendarClock, label: 'Deadlines', from: { x: 180, y: 250, rotate: 7 } },
];

export function StorytellingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  const items = useMemo(() => {
    if (!isMobile) return ITEMS;
    const scale = 0.5;
    return ITEMS.map((item) => ({
      ...item,
      from: { ...item.from, x: item.from.x * scale, y: item.from.y * scale },
    }));
  }, [isMobile]);

  const headingBeforeOpacity = useTransform(scrollYProgress, [0, 0.28, 0.42], [1, 1, 0]);
  const headingAfterOpacity = useTransform(scrollYProgress, [0.5, 0.68, 1], [0, 1, 1]);
  const centerScale = useTransform(scrollYProgress, [0.45, 0.85], [0.8, 1]);
  const centerOpacity = useTransform(scrollYProgress, [0.4, 0.7], [0, 1]);
  const lineOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.75, 0.95], [0, 0.5, 0.5, 0]);

  return (
    <section id="solutions" ref={containerRef} className="relative bg-ink-950" style={{ height: '260vh' }}>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <Container className="relative flex h-full flex-col items-center justify-center">
          <div className="relative mb-2 h-16 w-full max-w-lg text-center">
            <motion.p
              style={prefersReducedMotion ? undefined : { opacity: headingBeforeOpacity }}
              className="absolute inset-x-0 text-2xl font-medium tracking-tight text-ink-100 sm:text-3xl"
            >
              Work, scattered across six different tools.
            </motion.p>
            <motion.p
              style={prefersReducedMotion ? undefined : { opacity: headingAfterOpacity }}
              className="absolute inset-x-0 text-2xl font-medium tracking-tight text-ink-50 sm:text-3xl"
            >
              One workspace. <span className="text-gold-400">Total clarity.</span>
            </motion.p>
          </div>

          <div className="relative mt-10 h-[440px] w-full max-w-2xl">
            <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
              <motion.g style={{ opacity: prefersReducedMotion ? 0 : lineOpacity }}>
                {items.map((item, index) => (
                  <line
                    key={item.label}
                    x1="50%"
                    y1="50%"
                    x2={`calc(50% + ${item.from.x}px)`}
                    y2={`calc(50% + ${item.from.y}px)`}
                    stroke="#CEA254"
                    strokeWidth={1}
                    strokeDasharray="4 5"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  />
                ))}
              </motion.g>
            </svg>

            {items.map((item, index) => (
              <ScatteredCard
                key={item.label}
                item={item}
                index={index}
                scrollYProgress={scrollYProgress}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}

            <motion.div
              style={
                prefersReducedMotion
                  ? { left: '50%', top: '50%' }
                  : { scale: centerScale, opacity: centerOpacity, left: '50%', top: '50%' }
              }
              className="absolute w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gold-500/30 bg-ink-900 p-6 text-center shadow-glow-gold"
            >
              <div className="mx-auto flex w-fit items-center justify-center">
                <Logo variant="mark" />
              </div>
              <p className="mt-3 text-sm font-medium text-ink-50">Everything, connected</p>
              <p className="mt-1 text-xs text-ink-400">One flow from request to resolution.</p>
            </motion.div>
          </div>
        </Container>
      </div>
    </section>
  );
}
