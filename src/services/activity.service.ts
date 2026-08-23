import type { ActivityEvent, AppNotification } from '@/types';
import { activityEvents, notifications as seedNotifications } from '@/mock-data';
import { withLatency } from './latency';

export interface ActivityService {
  list(): Promise<ActivityEvent[]>;
  listNotifications(): Promise<AppNotification[]>;
  markNotificationRead(id: string): Promise<AppNotification>;
  markAllNotificationsRead(): Promise<void>;
}

let notificationStore = [...seedNotifications];

class MockActivityService implements ActivityService {
  async list(): Promise<ActivityEvent[]> {
    const sorted = [...activityEvents].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    return withLatency(sorted);
  }

  async listNotifications(): Promise<AppNotification[]> {
    return withLatency([...notificationStore]);
  }

  async markNotificationRead(id: string): Promise<AppNotification> {
    const existing = notificationStore.find((n) => n.id === id);
    if (!existing) throw new Error(`Notification ${id} not found`);
    const updated = { ...existing, read: true };
    notificationStore = notificationStore.map((n) => (n.id === id ? updated : n));
    return withLatency(updated, 120);
  }

  async markAllNotificationsRead(): Promise<void> {
    notificationStore = notificationStore.map((n) => ({ ...n, read: true }));
    return withLatency(undefined, 120);
  }
}

export const activityService: ActivityService = new MockActivityService();
