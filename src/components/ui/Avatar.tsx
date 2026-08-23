import { cva, type VariantProps } from 'class-variance-authority';
import { initials } from '@/lib/format';
import { cn } from '@/lib/cn';

const avatarVariants = cva('inline-flex shrink-0 items-center justify-center rounded-full font-medium text-ink-950', {
  variants: {
    size: {
      xs: 'h-6 w-6 text-[10px]',
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-14 w-14 text-base',
    },
  },
  defaultVariants: { size: 'md' },
});

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  name: string;
  color?: string;
  className?: string;
  ring?: boolean;
}

export function Avatar({ name, color = '#CEA254', size, className, ring }: AvatarProps) {
  return (
    <span
      className={cn(avatarVariants({ size }), ring && 'ring-2 ring-surface', className)}
      style={{ backgroundColor: color }}
      title={name}
    >
      {initials(name)}
    </span>
  );
}
