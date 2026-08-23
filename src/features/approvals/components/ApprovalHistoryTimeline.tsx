import { motion } from 'framer-motion';
import { Check, MessageCircle, Send, ThumbsDown, ThumbsUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ApprovalAction, ApprovalHistoryEntry } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { getUserById } from '@/mock-data';
import { formatDate } from '@/lib/format';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/cn';

const ACTION_CONFIG: Record<ApprovalAction, { label: string; icon: LucideIcon; className: string }> = {
  submitted: { label: 'submitted the request', icon: Send, className: 'border-border-strong bg-surface-overlay text-text-secondary' },
  approved: { label: 'approved', icon: ThumbsUp, className: 'border-success-500/40 bg-success-500/10 text-success-400' },
  rejected: { label: 'rejected', icon: ThumbsDown, className: 'border-danger-500/40 bg-danger-500/10 text-danger-400' },
  'changes-requested': { label: 'requested changes', icon: MessageCircle, className: 'border-info-500/40 bg-info-500/10 text-info-400' },
  commented: { label: 'commented', icon: MessageCircle, className: 'border-border-strong bg-surface-overlay text-text-secondary' },
  pending: { label: 'is pending', icon: Check, className: 'border-border-strong bg-surface-overlay text-text-secondary' },
};

export function ApprovalHistoryTimeline({ history }: { history: ApprovalHistoryEntry[] }) {
  return (
    <motion.ol variants={staggerContainer(0.07)} initial="hidden" animate="visible" className="flex flex-col">
      {history.map((entry, index) => {
        const actor = getUserById(entry.actorId);
        const config = ACTION_CONFIG[entry.action];
        const Icon = config.icon;
        return (
          <motion.li key={entry.id} variants={fadeUp} className="relative flex gap-3 pb-6 last:pb-0">
            {index < history.length - 1 && <span className="absolute left-[15px] top-8 h-full w-px bg-border-default" />}
            <span className={cn('z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border', config.className)}>
              <Icon size={13} />
            </span>
            <div className="min-w-0 flex-1 pt-1">
              <p className="text-xs text-text-secondary">
                <span className="font-medium text-text-primary">{actor?.name ?? 'Someone'}</span> {config.label}
              </p>
              {entry.note && (
                <p className="mt-1.5 rounded-lg border border-border-default bg-surface-overlay px-3 py-2 text-xs text-text-secondary">
                  {entry.note}
                </p>
              )}
              <div className="mt-1 flex items-center gap-2">
                {actor && <Avatar name={actor.name} color={actor.color} size="xs" />}
                <p className="text-[10px] text-text-tertiary">{formatDate(entry.timestamp, 'MMM d, yyyy · h:mm a')}</p>
              </div>
            </div>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}
