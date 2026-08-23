import { motion } from 'framer-motion';
import { Logo } from '@/components/shared/Logo';

export function RouteLoader() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-surface">
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Logo variant="mark" />
      </motion.div>
    </div>
  );
}
