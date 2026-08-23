import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/cn';

interface RadialProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  trackClassName?: string;
  progressClassName?: string;
  label?: string;
}

export function RadialProgress({
  value,
  size = 56,
  strokeWidth = 5,
  className,
  trackClassName,
  progressClassName,
  label,
}: RadialProgressProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg ref={ref} width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={cn('stroke-border-default', trackClassName)}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: inView ? offset : circumference }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className={cn('stroke-gold-400', progressClassName)}
        />
      </svg>
      {label !== undefined && (
        <span className="absolute font-mono text-[11px] font-medium text-text-primary">{label}</span>
      )}
    </div>
  );
}
