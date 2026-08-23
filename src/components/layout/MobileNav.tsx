import * as DialogPrimitive from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { Avatar } from '@/components/ui/Avatar';
import { PRIMARY_NAV_ITEMS, SECONDARY_NAV_ITEMS } from './nav-items';
import { useUiStore } from '@/store/ui.store';
import { useAuthStore } from '@/store/auth.store';
import { transition } from '@/lib/motion';
import { cn } from '@/lib/cn';

export function MobileNav() {
  const open = useUiStore((s) => s.mobileNavOpen);
  const setOpen = useUiStore((s) => s.setMobileNavOpen);
  const session = useAuthStore((s) => s.session);
  const clearSession = useAuthStore((s) => s.clearSession);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    setOpen(false);
    navigate('/');
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-ink-950/60 backdrop-blur-sm lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transition.fast}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild forceMount onOpenAutoFocus={(e) => e.preventDefault()}>
              <motion.div
                className="fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col border-r border-border-strong bg-surface-raised shadow-raised focus:outline-none lg:hidden"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={transition.base}
              >
                <DialogPrimitive.Title className="sr-only">Navigation</DialogPrimitive.Title>
                <div className="flex h-[64px] items-center justify-between border-b border-border-default px-5">
                  <Logo />
                  <DialogPrimitive.Close className="rounded-md p-1 text-text-tertiary hover:bg-surface-overlay">
                    <X size={18} />
                  </DialogPrimitive.Close>
                </div>

                <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
                  {PRIMARY_NAV_ITEMS.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                          isActive ? 'bg-surface-overlay text-text-primary' : 'text-text-tertiary',
                        )
                      }
                    >
                      <item.icon size={17} strokeWidth={1.75} />
                      {item.label}
                    </NavLink>
                  ))}
                </nav>

                <div className="border-t border-border-default p-3">
                  {SECONDARY_NAV_ITEMS.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                          isActive ? 'bg-surface-overlay text-text-primary' : 'text-text-tertiary',
                        )
                      }
                    >
                      <item.icon size={17} strokeWidth={1.75} />
                      {item.label}
                    </NavLink>
                  ))}

                  {session?.user && (
                    <div className="mt-2 flex items-center gap-2.5 rounded-lg px-3 py-2.5">
                      <Avatar name={session.user.name} color={session.user.color} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-text-primary">{session.user.name}</p>
                      </div>
                      <button onClick={handleLogout} className="text-text-tertiary hover:text-danger-400">
                        <LogOut size={15} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
