import type { AppNotification } from '@/types';
import { hoursFromNow } from './date-seed';

export const notifications: AppNotification[] = [
  { id: 'n_1', title: 'Approval needs your review', body: 'Figma Enterprise seats — Design team is waiting on Dept. Head Review.', read: false, timestamp: hoursFromNow(-1), kind: 'approval' },
  { id: 'n_2', title: 'You were assigned a task', body: 'Refresh Q3 team capacity plan was assigned to you.', read: false, timestamp: hoursFromNow(-4), kind: 'assignment' },
  { id: 'n_3', title: 'Sarah mentioned you', body: 'in a comment on Audit color contrast across dark theme.', read: false, timestamp: hoursFromNow(-6), kind: 'mention' },
  { id: 'n_4', title: 'Project health changed', body: 'Meridian Expansion moved to at-risk.', read: true, timestamp: hoursFromNow(-20), kind: 'system' },
  { id: 'n_5', title: 'Approval decision made', body: 'Your Contractor engagement request was approved by Alex Rivera.', read: true, timestamp: hoursFromNow(-30), kind: 'approval' },
  { id: 'n_6', title: 'Deadline approaching', body: 'Beacon Onboarding Revamp is due in 4 days.', read: true, timestamp: hoursFromNow(-48), kind: 'system' },
];
