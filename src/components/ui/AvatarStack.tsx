import type { User } from '@/types';
import { Avatar } from './Avatar';
import { cn } from '@/lib/cn';

interface AvatarStackProps {
  users: User[];
  max?: number;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export function AvatarStack({ users, max = 4, size = 'sm', className }: AvatarStackProps) {
  const visible = users.slice(0, max);
  const overflow = users.length - visible.length;

  return (
    <div className={cn('flex items-center', className)}>
      {visible.map((user, index) => (
        <div key={user.id} style={{ marginLeft: index === 0 ? 0 : -8, zIndex: visible.length - index }}>
          <Avatar name={user.name} color={user.color} size={size} ring />
        </div>
      ))}
      {overflow > 0 && (
        <div
          className="ml-[-8px] flex h-8 w-8 items-center justify-center rounded-full bg-surface-overlay text-[11px] font-medium text-text-secondary ring-2 ring-surface"
          style={{ zIndex: 0 }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
