import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Gauge, ListChecks, Search, UserCheck, Users } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatTile } from '@/components/shared/StatTile';
import { PageHeader } from '@/components/shared/PageHeader';
import { TeamMemberCard } from './components/TeamMemberCard';
import { TeamMemberDrawer } from './components/TeamMemberDrawer';
import { teamService } from '@/services';
import { staggerContainer } from '@/lib/motion';
import type { Role, User } from '@/types';

export function TeamPage() {
  const { data: users = [], isLoading } = useQuery({ queryKey: ['users'], queryFn: teamService.list });
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<Role | 'all'>('all');
  const [selected, setSelected] = useState<User | null>(null);

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        if (role !== 'all' && u.role !== role) return false;
        if (search && !u.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [users, search, role],
  );

  const avgWorkload = users.length ? Math.round(users.reduce((s, u) => s + u.workload, 0) / users.length) : 0;
  const totalActive = users.reduce((s, u) => s + u.activeTasks, 0);

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <PageHeader title="Team" description={`${users.length} people across the workspace`} />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[104px] rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatTile label="Team members" value={users.length} icon={Users} tone="gold" />
          <StatTile label="Avg. workload" value={avgWorkload} suffix="%" icon={Gauge} />
          <StatTile label="Active tasks" value={totalActive} icon={ListChecks} />
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Search team…" icon={<Search size={14} />} value={search} onChange={(e) => setSearch(e.target.value)} className="sm:max-w-xs" />
        <Select value={role} onValueChange={(v) => setRole(v as Role | 'all')}>
          <SelectTrigger className="sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="administrator">Administrator</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="member">Member</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[220px] rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={UserCheck} title="No matches" description="Try a different search or role filter." />
      ) : (
        <motion.div variants={staggerContainer(0.05)} initial="hidden" animate="visible" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((user) => (
            <TeamMemberCard key={user.id} user={user} onClick={() => setSelected(user)} />
          ))}
        </motion.div>
      )}

      <TeamMemberDrawer user={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </div>
  );
}
