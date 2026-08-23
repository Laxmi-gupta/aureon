import { motion } from 'framer-motion';
import type { User } from '@/types';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { fadeUp } from '@/lib/motion';

const ROLE_LABEL: Record<User['role'], string> = {
  administrator: 'Administrator',
  manager: 'Manager',
  member: 'Member',
};

function workloadTone(workload: number): 'success' | 'accent' | 'danger' {
  if (workload >= 85) return 'danger';
  if (workload >= 65) return 'accent';
  return 'success';
}

export function TeamMemberCard({ user, onClick }: { user: User; onClick: () => void }) {
  return (
    <motion.div variants={fadeUp}>
      <Card interactive onClick={onClick} className="flex cursor-pointer flex-col p-5">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} color={user.color} size="lg" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text-primary">{user.name}</p>
            <p className="truncate text-xs text-text-tertiary">{user.title}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge tone="neutral">{ROLE_LABEL[user.role]}</Badge>
          <Badge tone="neutral">{user.department}</Badge>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] text-text-tertiary">
            <span>Workload</span>
            <span className="font-mono text-text-secondary">{user.workload}%</span>
          </div>
          <ProgressBar value={user.workload} tone={workloadTone(user.workload)} className="mt-1.5" />
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border-default pt-3 text-xs text-text-tertiary">
          <span>{user.activeTasks} active</span>
          <span>{user.completedTasks} completed</span>
        </div>
      </Card>
    </motion.div>
  );
}
