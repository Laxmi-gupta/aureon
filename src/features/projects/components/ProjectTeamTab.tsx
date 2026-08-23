import { motion } from 'framer-motion';
import type { User } from '@/types';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { fadeUp, staggerContainer } from '@/lib/motion';

export function ProjectTeamTab({ members, ownerId }: { members: User[]; ownerId: string }) {
  return (
    <motion.div variants={staggerContainer(0.06)} initial="hidden" animate="visible" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <motion.div key={member.id} variants={fadeUp}>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <Avatar name={member.name} color={member.color} size="md" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text-primary">{member.name}</p>
                <p className="truncate text-xs text-text-tertiary">{member.title}</p>
              </div>
              {member.id === ownerId && (
                <span className="ml-auto shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                  Owner
                </span>
              )}
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] text-text-tertiary">
                <span>Workload</span>
                <span className="font-mono text-text-secondary">{member.workload}%</span>
              </div>
              <ProgressBar value={member.workload} className="mt-1.5" />
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
