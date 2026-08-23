export type ActivityTargetType = 'task' | 'project' | 'approval' | 'workflow' | 'team';

export interface ActivityEvent {
  id: string;
  actorId: string;
  verb: string;
  targetType: ActivityTargetType;
  targetLabel: string;
  meta?: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  timestamp: string;
  kind: 'approval' | 'mention' | 'assignment' | 'system';
}
