import { Card, CardContent } from '@/components/ui/Card';
import { ActivityFeed } from '@/components/shared/ActivityFeed';
import type { ActivityEvent } from '@/types';

export function ProjectActivityTab({ events }: { events: ActivityEvent[] }) {
  return (
    <Card>
      <CardContent>
        <ActivityFeed events={events} />
      </CardContent>
    </Card>
  );
}
