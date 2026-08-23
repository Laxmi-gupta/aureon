import {
  Activity,
  BarChart3,
  CheckCircle2,
  Compass,
  FolderKanban,
  ListChecks,
  Settings,
  Users,
  Workflow,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { label: 'Overview', to: '/app/overview', icon: Compass },
  { label: 'Projects', to: '/app/projects', icon: FolderKanban },
  { label: 'My Tasks', to: '/app/tasks', icon: ListChecks },
  { label: 'Workflows', to: '/app/workflows', icon: Workflow },
  { label: 'Approvals', to: '/app/approvals', icon: CheckCircle2 },
  { label: 'Team', to: '/app/team', icon: Users },
  { label: 'Analytics', to: '/app/analytics', icon: BarChart3 },
  { label: 'Activity', to: '/app/activity', icon: Activity },
];

export const SECONDARY_NAV_ITEMS: NavItem[] = [{ label: 'Settings', to: '/app/settings', icon: Settings }];
