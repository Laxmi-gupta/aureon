import { Circle, CircleCheck, CircleDot, Eye } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { TaskStatus } from '@/types';

export const STATUS_CONFIG: Record<TaskStatus, { label: string; icon: LucideIcon; dot: string }> = {
  planned: { label: 'Planned', icon: Circle, dot: 'bg-ink-300' },
  'in-progress': { label: 'In Progress', icon: CircleDot, dot: 'bg-info-500' },
  review: { label: 'In Review', icon: Eye, dot: 'bg-warning-500' },
  completed: { label: 'Completed', icon: CircleCheck, dot: 'bg-success-500' },
};

export const STATUS_ORDER: TaskStatus[] = ['planned', 'in-progress', 'review', 'completed'];
