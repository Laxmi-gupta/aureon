import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { PageHeader } from '@/components/shared/PageHeader';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { ActivityFeed } from '@/components/shared/ActivityFeed';
import { activityService } from '@/services';
import type { ActivityTargetType } from '@/types';

const TYPE_LABEL: Record<ActivityTargetType, string> = {
  task: 'Tasks',
  project: 'Projects',
  approval: 'Approvals',
  workflow: 'Workflows',
  team: 'Team',
};

export function ActivityPage() {
  const { data: events = [], isLoading } = useQuery({ queryKey: ['activity'], queryFn: activityService.list });
  const [search, setSearch] = useState('');
  const [type, setType] = useState<ActivityTargetType | 'all'>('all');

  const filtered = useMemo(
    () =>
      events.filter((e) => {
        if (type !== 'all' && e.targetType !== type) return false;
        if (search && !e.targetLabel.toLowerCase().includes(search.toLowerCase()) && !e.verb.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [events, search, type],
  );

  return (
    <div className="mx-auto flex max-w-[900px] flex-col gap-6">
      <PageHeader title="Activity" description="Everything moving across the workspace, in one feed" />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Search activity…" icon={<Search size={14} />} value={search} onChange={(e) => setSearch(e.target.value)} className="sm:max-w-xs" />
        <Select value={type} onValueChange={(v) => setType(v as ActivityTargetType | 'all')}>
          <SelectTrigger className="sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All activity</SelectItem>
            {Object.entries(TYPE_LABEL).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Skeleton className="h-[500px] rounded-2xl" />
      ) : (
        <Card>
          <CardContent>
            <ActivityFeed events={filtered} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
