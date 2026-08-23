import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/cn';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, align = 'left', className }: SectionHeadingProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}
    >
      {eyebrow && (
        <span className="mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-gold-400">
          <span className="h-px w-6 bg-gold-400/60" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-medium leading-[1.15] tracking-tight text-ink-50 sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-ink-300">{description}</p>}
    </motion.div>
  );
}
