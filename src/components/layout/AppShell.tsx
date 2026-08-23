import { useEffect } from 'react';
import { getUserById, CURRENT_USER_ID } from '@/mock-data';
import { useAuthStore } from '@/store/auth.store';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNav } from './MobileNav';
import { PageTransition } from './PageTransition';
import { CommandPalette } from './CommandPalette';
import { AiWorkspace } from '@/features/ai-assistant/AiWorkspace';

/**
 * Establishes a demo session automatically so "Explore Platform" on the
 * landing page can drop a visitor straight into the product without
 * forcing a real login.
 */
export function AppShell() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    if (isAuthenticated) return;
    const demoUser = getUserById(CURRENT_USER_ID);
    if (demoUser) setSession({ user: demoUser, token: 'demo-session' });
  }, [isAuthenticated, setSession]);

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-text-primary">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <PageTransition />
        </main>
      </div>
      <MobileNav />
      <CommandPalette />
      <AiWorkspace />
    </div>
  );
}
