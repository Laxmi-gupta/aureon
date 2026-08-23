import { useState } from 'react';
import { Bell, Moon, Palette, Sun, UserRound } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { PageHeader } from '@/components/shared/PageHeader';
import { Input, Label } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { Avatar } from '@/components/ui/Avatar';
import { toast } from '@/components/ui/toast';
import { useAuthStore } from '@/store/auth.store';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/cn';

export function SettingsPage() {
  const session = useAuthStore((s) => s.session);
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState(session?.user?.name ?? '');
  const [email, setEmail] = useState(session?.user?.email ?? '');
  const [notifications, setNotifications] = useState({ approvals: true, mentions: true, deadlines: true, weeklyDigest: false });

  const handleSave = () => toast.success('Profile updated');

  return (
    <div className="mx-auto flex max-w-[760px] flex-col gap-6">
      <PageHeader title="Settings" description="Manage your profile, appearance, and notifications" />

      <Card>
        <CardContent>
          <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
            <UserRound size={15} />
            Profile
          </div>
          <div className="mt-4 flex items-center gap-4">
            {session?.user && <Avatar name={session.user.name} color={session.user.color} size="lg" />}
            <div>
              <p className="text-sm font-medium text-text-primary">{session?.user?.name}</p>
              <p className="text-xs text-text-tertiary">{session?.user?.title}</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <Button size="sm" className="mt-5" onClick={handleSave}>
            Save changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
            <Palette size={15} />
            Appearance
          </div>
          <p className="mt-1 text-xs text-text-tertiary">Choose how Aureon looks on this device</p>
          <div className="mt-4 flex gap-3">
            {(['light', 'dark'] as const).map((option) => (
              <button
                key={option}
                onClick={() => setTheme(option)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium capitalize transition-colors',
                  theme === option ? 'border-accent bg-accent/10 text-accent' : 'border-border-default text-text-secondary hover:border-border-strong',
                )}
              >
                {option === 'light' ? <Sun size={15} /> : <Moon size={15} />}
                {option}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
            <Bell size={15} />
            Notifications
          </div>
          <div className="mt-4 flex flex-col divide-y divide-border-default">
            {[
              { key: 'approvals' as const, label: 'Approval requests', description: 'When something needs your decision' },
              { key: 'mentions' as const, label: 'Mentions & comments', description: 'When someone mentions you' },
              { key: 'deadlines' as const, label: 'Deadline reminders', description: 'Upcoming and overdue work' },
              { key: 'weeklyDigest' as const, label: 'Weekly digest', description: 'A summary every Monday morning' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-text-primary">{item.label}</p>
                  <p className="text-xs text-text-tertiary">{item.description}</p>
                </div>
                <Switch
                  checked={notifications[item.key]}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, [item.key]: checked === true }))}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
