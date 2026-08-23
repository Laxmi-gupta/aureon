import { motion } from 'framer-motion';
import type { User } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/cn';

function toneFor(workload: number) {
  if (workload >= 85) return 'bg-danger-500';
  if (workload >= 65) return 'bg-accent';
  return 'bg-success-500';
}

export function WorkloadPanel({ users }: { users: User[] }) {
  const sorted = [...users].sort((a, b) => b.workload - a.workload).slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <div>
          <h3 className="text-sm font-medium text-text-primary">Team capacity</h3>
          <p className="mt-0.5 text-xs text-text-tertiary">Current workload by team member</p>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div variants={staggerContainer(0.06)} initial="hidden" animate="visible" className="flex flex-col gap-3.5">
          {sorted.map((member) => (
            <motion.div key={member.id} variants={fadeUp} className="flex items-center gap-3">
              <Avatar name={member.name} color={member.color} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="truncate font-medium text-text-primary">{member.name}</span>
                  <span className="font-mono text-text-tertiary">{member.workload}%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border-default">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${member.workload}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={cn('h-full rounded-full', toneFor(member.workload))}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
}
