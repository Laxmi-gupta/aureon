import type { ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { transition } from '@/lib/motion';

interface SlideOverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  width?: string;
  headerAccessory?: ReactNode;
}

export function SlideOver({ open, onOpenChange, title, description, children, width = 'max-w-md', headerAccessory }: SlideOverProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-ink-950/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transition.fast}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild forceMount onOpenAutoFocus={(e) => e.preventDefault()}>
              <motion.div
                className={cn(
                  'fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l border-border-strong bg-surface-raised shadow-raised focus:outline-none',
                  width,
                )}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={transition.base}
              >
                <div className="flex items-start justify-between gap-4 border-b border-border-default p-5">
                  <div>
                    <DialogPrimitive.Title className="text-base font-medium text-text-primary">{title}</DialogPrimitive.Title>
                    {description && (
                      <DialogPrimitive.Description className="mt-1 text-sm text-text-secondary">
                        {description}
                      </DialogPrimitive.Description>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {headerAccessory}
                    <DialogPrimitive.Close className="rounded-md p-1 text-text-tertiary transition-colors hover:bg-surface-overlay hover:text-text-primary">
                      <X size={16} />
                    </DialogPrimitive.Close>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">{children}</div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
