import type { User } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/cn';

interface UserChipProps {
  user: User | undefined;
  size?: 'xs' | 'sm' | 'md';
  showTitle?: boolean;
  className?: string;
}

export function UserChip({ user, size = 'sm', showTitle, className }: UserChipProps) {
  if (!user) {
    return <span className={cn('text-xs text-text-tertiary', className)}>Unassigned</span>;
  }
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Avatar name={user.name} color={user.color} size={size} />
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-text-primary">{user.name}</p>
        {showTitle && <p className="truncate text-[11px] text-text-tertiary">{user.title}</p>}
      </div>
    </div>
  );
}
