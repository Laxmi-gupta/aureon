import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, ListChecks, Search, Sparkles, Sun, User as UserIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PRIMARY_NAV_ITEMS } from './nav-items';
import { projects, tasks, users } from '@/mock-data';
import { useUiStore } from '@/store/ui.store';
import { useTheme } from '@/hooks/useTheme';
import { transition } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { Kbd } from '@/components/ui/Kbd';

interface ResultItem {
  id: string;
  label: string;
  hint?: string;
  icon: LucideIcon;
  onSelect: () => void;
}

export function CommandPalette() {
  const open = useUiStore((s) => s.commandPaletteOpen);
  const setOpen = useUiStore((s) => s.setCommandPaletteOpen);
  const setAiWorkspaceOpen = useUiStore((s) => s.setAiWorkspaceOpen);
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(!open);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, setOpen]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const close = () => setOpen(false);

  const results = useMemo<{ heading: string; items: ResultItem[] }[]>(() => {
    const q = query.trim().toLowerCase();

    const pages: ResultItem[] = PRIMARY_NAV_ITEMS.filter((item) => !q || item.label.toLowerCase().includes(q)).map(
      (item) => ({
        id: `page-${item.to}`,
        label: item.label,
        hint: 'Go to page',
        icon: item.icon,
        onSelect: () => {
          navigate(item.to);
          close();
        },
      }),
    );

    const actions: ResultItem[] = [
      {
        id: 'action-new-task',
        label: 'New task',
        hint: 'Create',
        icon: ListChecks,
        onSelect: () => {
          navigate('/app/tasks?create=task');
          close();
        },
      },
      {
        id: 'action-new-project',
        label: 'New project',
        hint: 'Create',
        icon: FolderKanban,
        onSelect: () => {
          navigate('/app/projects?create=project');
          close();
        },
      },
      {
        id: 'action-ai',
        label: 'Ask Aureon AI',
        hint: 'Open assistant',
        icon: Sparkles,
        onSelect: () => {
          setAiWorkspaceOpen(true);
          close();
        },
      },
      {
        id: 'action-theme',
        label: 'Toggle theme',
        hint: 'Appearance',
        icon: Sun,
        onSelect: () => {
          toggleTheme();
          close();
        },
      },
    ].filter((item) => !q || item.label.toLowerCase().includes(q));

    const matchedProjects: ResultItem[] = q
      ? projects
          .filter((p) => p.name.toLowerCase().includes(q))
          .slice(0, 4)
          .map((p) => ({
            id: `project-${p.id}`,
            label: p.name,
            hint: 'Project',
            icon: FolderKanban,
            onSelect: () => {
              navigate(`/app/projects/${p.id}`);
              close();
            },
          }))
      : [];

    const matchedTasks: ResultItem[] = q
      ? tasks
          .filter((t) => t.title.toLowerCase().includes(q))
          .slice(0, 4)
          .map((t) => ({
            id: `task-${t.id}`,
            label: t.title,
            hint: 'Task',
            icon: ListChecks,
            onSelect: () => {
              navigate('/app/tasks');
              close();
            },
          }))
      : [];

    const matchedPeople: ResultItem[] = q
      ? users
          .filter((u) => u.name.toLowerCase().includes(q))
          .slice(0, 4)
          .map((u) => ({
            id: `user-${u.id}`,
            label: u.name,
            hint: u.title,
            icon: UserIcon,
            onSelect: () => {
              navigate('/app/team');
              close();
            },
          }))
      : [];

    const groups = [
      { heading: 'Pages', items: pages },
      { heading: 'Actions', items: actions },
      { heading: 'Projects', items: matchedProjects },
      { heading: 'Tasks', items: matchedTasks },
      { heading: 'People', items: matchedPeople },
    ].filter((g) => g.items.length > 0);

    return groups;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const flatItems = useMemo(() => results.flatMap((g) => g.items), [results]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function handleKeyDown(event: ReactKeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatItems.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      flatItems[activeIndex]?.onSelect();
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[60] bg-ink-950/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transition.fast}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild forceMount onOpenAutoFocus={(e) => e.preventDefault()}>
              <motion.div
                className="fixed left-1/2 top-[14vh] z-[60] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border border-border-strong bg-surface-raised shadow-raised"
                initial={{ opacity: 0, scale: 0.97, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -8 }}
                transition={transition.base}
              >
                <DialogPrimitive.Title className="sr-only">Command palette</DialogPrimitive.Title>
                <div className="flex items-center gap-3 border-b border-border-default px-4">
                  <Search size={16} className="text-text-tertiary" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search pages, projects, tasks, people…"
                    className="h-12 flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
                  />
                  <Kbd>Esc</Kbd>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2">
                  {flatItems.length === 0 && (
                    <p className="px-3 py-8 text-center text-sm text-text-tertiary">No results for "{query}"</p>
                  )}
                  {results.map((group) => (
                    <div key={group.heading} className="mb-1">
                      <p className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-wide text-text-tertiary">
                        {group.heading}
                      </p>
                      {group.items.map((item) => {
                        const flatIndex = flatItems.findIndex((f) => f.id === item.id);
                        const isActive = flatIndex === activeIndex;
                        return (
                          <button
                            key={item.id}
                            onClick={item.onSelect}
                            onMouseEnter={() => setActiveIndex(flatIndex)}
                            className={cn(
                              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                              isActive ? 'bg-surface-overlay text-text-primary' : 'text-text-secondary',
                            )}
                          >
                            <item.icon size={15} className="shrink-0 text-text-tertiary" />
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.hint && <span className="text-xs text-text-tertiary">{item.hint}</span>}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
