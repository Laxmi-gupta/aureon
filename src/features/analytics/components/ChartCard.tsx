import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { fadeUp, viewportOnce } from '@/lib/motion';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ChartCard({ title, subtitle, action, children, className }: ChartCardProps) {
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
      <Card className={className}>
        <div className="flex items-start justify-between gap-3 p-5 pb-0">
          <div>
            <h3 className="text-sm font-medium text-text-primary">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-text-tertiary">{subtitle}</p>}
          </div>
          {action}
        </div>
        <div className="p-5">{children}</div>
      </Card>
    </motion.div>
  );
}
