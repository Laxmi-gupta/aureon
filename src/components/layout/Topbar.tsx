import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Bell,
  ChevronDown,
  FileCheck2,
  FolderPlus,
  ListPlus,
  LogOut,
  Menu,
  Moon,
  Plus,
  Search,
  Settings,
  Sparkles,
  Sun,
  UserRound,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Kbd } from '@/components/ui/Kbd';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { activityService } from '@/services';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';
import { useTheme } from '@/hooks/useTheme';
import { formatRelativeTime } from '@/lib/format';
import { cn } from '@/lib/cn';

export function Topbar() {
  const navigate = useNavigate();
  const session = useAuthStore((s) => s.session);
  const clearSession = useAuthStore((s) => s.clearSession);
  const setCommandPaletteOpen = useUiStore((s) => s.setCommandPaletteOpen);
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen);
  const setAiWorkspaceOpen = useUiStore((s) => s.setAiWorkspaceOpen);
  const { theme, toggleTheme } = useTheme();
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: activityService.listNotifications,
  });
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    await activityService.markAllNotificationsRead();
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  const handleLogout = () => {
    clearSession();
    navigate('/');
  };

  return (
    <header className="flex h-[64px] shrink-0 items-center gap-3 border-b border-border-default bg-surface px-4 sm:px-6">
      <button
        onClick={() => setMobileNavOpen(true)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-raised lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="flex h-9 min-w-0 flex-1 items-center gap-2.5 rounded-lg border border-border-default bg-surface-raised px-3 text-left text-[13px] text-text-tertiary transition-colors hover:border-border-strong sm:max-w-sm"
      >
        <Search size={14} className="shrink-0" />
        <span className="flex-1 truncate">Search Aureon…</span>
        <Kbd className="hidden sm:inline-flex">⌘K</Kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="hidden sm:inline-flex"
          onClick={() => setAiWorkspaceOpen(true)}
          icon={<Sparkles size={14} className="text-gold-400" />}
        >
          Ask AI
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" icon={<Plus size={14} />}>
              <span className="hidden sm:inline">Create</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => navigate('/app/tasks?create=task')}>
              <ListPlus size={14} /> New task
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => navigate('/app/projects?create=project')}>
              <FolderPlus size={14} /> New project
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => navigate('/app/approvals?create=1')}>
              <FileCheck2 size={14} /> New approval request
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-raised"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-raised">
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-gold-400" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-2.5 py-1.5">
              <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="text-[11px] font-medium text-gold-400 hover:text-gold-300">
                  Mark all read
                </button>
              )}
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 && (
                <p className="px-3 py-6 text-center text-xs text-text-tertiary">You're all caught up.</p>
              )}
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'flex gap-2.5 rounded-lg px-2.5 py-2.5',
                    !notification.read && 'bg-surface-overlay/60',
                  )}
                >
                  <span className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', notification.read ? 'bg-transparent' : 'bg-gold-400')} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-text-primary">{notification.title}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-text-tertiary">{notification.body}</p>
                    <p className="mt-1 text-[10px] text-text-tertiary">{formatRelativeTime(notification.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 rounded-lg py-1 pl-1 pr-1.5 transition-colors hover:bg-surface-raised">
              {session?.user && <Avatar name={session.user.name} color={session.user.color} size="sm" />}
              <ChevronDown size={13} className="hidden text-text-tertiary sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2.5 py-2">
              <p className="text-sm font-medium text-text-primary">{session?.user?.name}</p>
              <p className="text-xs text-text-tertiary">{session?.user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate('/app/settings')}>
              <UserRound size={14} /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => navigate('/app/settings')}>
              <Settings size={14} /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onSelect={handleLogout}>
              <LogOut size={14} /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
