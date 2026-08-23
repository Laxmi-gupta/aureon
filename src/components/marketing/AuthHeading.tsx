import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';

export function AuthHeading({ title, description }: { title: string; description: string }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
      <h1 className="text-2xl font-medium tracking-tight text-ink-50">{title}</h1>
      <p className="mt-2 text-sm text-ink-400">{description}</p>
    </motion.div>
  );
}
