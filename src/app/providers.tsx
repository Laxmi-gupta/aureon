import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'framer-motion';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/query-client';
import { useThemeSync } from '@/hooks/useTheme';
import { TooltipProvider } from '@/components/ui/Tooltip';

function ThemeSync() {
  useThemeSync();
  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <ThemeSync />
          <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
          <Toaster
            position="bottom-right"
            theme="dark"
            toastOptions={{
              classNames: {
                toast:
                  'rounded-xl! border! border-border-strong! bg-surface-raised! text-text-primary! shadow-raised!',
                title: 'text-sm! font-medium!',
                description: 'text-text-secondary!',
                actionButton: 'bg-accent! text-ink-950!',
              },
            }}
          />
        </BrowserRouter>
      </MotionConfig>
    </QueryClientProvider>
  );
}
