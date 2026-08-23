import { isThisWeek, isToday, isYesterday } from 'date-fns';
import {
  Activity as ActivityIcon,
  AlertTriangle,
  CheckCircle2,
  Flag,
  MessageCircle,
  PlusCircle,
  Send,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  UserPlus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ActivityEvent } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { getUserById } from '@/mock-data';
import { formatRelativeTime } from '@/lib/format';
import { EmptyState } from '@/components/ui/EmptyState';

function iconFor(verb: string): LucideIcon {
  if (verb.includes('completed')) return CheckCircle2;
  if (verb.includes('submitted')) return Send;
  if (verb.includes('commented')) return MessageCircle;
  if (verb.includes('assigned')) return UserPlus;
  if (verb.includes('milestone') || verb.includes('reached')) return Flag;
  if (verb.includes('approved')) return ThumbsUp;
  if (verb.includes('rejected') || verb.includes('changes')) return ThumbsDown;
  if (verb.includes('flagged') || verb.includes('risk')) return AlertTriangle;
  if (verb.includes('created')) return PlusCircle;
  if (verb.includes('capacity') || verb.includes('updated')) return TrendingUp;
  return ActivityIcon;
}

function groupLabel(iso: string): string {
  const date = new Date(iso);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  if (isThisWeek(date)) return 'This week';
  return 'Earlier';
}

export function ActivityFeed({ events, limit }: { events: ActivityEvent[]; limit?: number }) {
  const sorted = [...events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const trimmed = limit ? sorted.slice(0, limit) : sorted;

  if (trimmed.length === 0) {
    return <EmptyState icon={ActivityIcon} title="No activity yet" description="Team activity will show up here." />;
  }

  const groups: { label: string; events: ActivityEvent[] }[] = [];
  for (const event of trimmed) {
    const label = groupLabel(event.timestamp);
    const existing = groups.find((g) => g.label === label);
    if (existing) existing.events.push(event);
    else groups.push({ label, events: [event] });
  }

  return (
    <div className="flex flex-col gap-5">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-text-tertiary">{group.label}</p>
          <ul className="flex flex-col gap-0.5">
            {group.events.map((event) => {
              const actor = getUserById(event.actorId);
              const Icon = iconFor(event.verb);
              return (
                <li key={event.id} className="flex items-start gap-3 rounded-lg px-1 py-2 transition-colors hover:bg-surface-overlay">
                  {actor ? (
                    <Avatar name={actor.name} color={actor.color} size="xs" />
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-overlay text-text-tertiary">
                      <Icon size={12} />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs leading-relaxed text-text-secondary">
                      <span className="font-medium text-text-primary">{actor?.name ?? 'Someone'}</span> {event.verb}{' '}
                      <span className="font-medium text-text-primary">{event.targetLabel}</span>
                      {event.meta && <span className="text-text-tertiary"> · {event.meta}</span>}
                    </p>
                    <p className="mt-0.5 text-[10px] text-text-tertiary">{formatRelativeTime(event.timestamp)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
