import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { Tooltip } from '@/components/ui/Tooltip';
import { PRIMARY_NAV_ITEMS, SECONDARY_NAV_ITEMS } from './nav-items';
import { useUiStore } from '@/store/ui.store';
import { cn } from '@/lib/cn';
import type { NavItem } from './nav-items';

function NavRow({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const row = (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors',
          isActive ? 'bg-surface-overlay text-text-primary' : 'text-text-tertiary hover:bg-surface-overlay/60 hover:text-text-secondary',
          collapsed && 'justify-center px-0',
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="sidebar-active-indicator"
              className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <item.icon size={17} strokeWidth={1.75} className="shrink-0" />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </>
      )}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip content={item.label} side="right">
        {row}
      </Tooltip>
    );
  }
  return row;
}

export function Sidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <aside
      className={cn(
        'hidden shrink-0 flex-col border-r border-border-default bg-surface-raised transition-[width] duration-200 ease-out lg:flex',
        collapsed ? 'w-[76px]' : 'w-64',
      )}
    >
      <div className={cn('flex h-[64px] items-center border-b border-border-default px-5', collapsed && 'justify-center px-0')}>
        {collapsed ? <Logo variant="mark" /> : <Logo />}
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {PRIMARY_NAV_ITEMS.map((item) => (
          <NavRow key={item.to} item={item} collapsed={collapsed} />
        ))}
      </nav>

      <div className="flex flex-col gap-1 border-t border-border-default p-3">
        {SECONDARY_NAV_ITEMS.map((item) => (
          <NavRow key={item.to} item={item} collapsed={collapsed} />
        ))}
        <button
          onClick={toggleSidebar}
          className={cn(
            'mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-text-tertiary transition-colors hover:bg-surface-overlay/60 hover:text-text-secondary',
            collapsed && 'justify-center px-0',
          )}
        >
          {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          {!collapsed && 'Collapse'}
        </button>
      </div>
    </aside>
  );
}
