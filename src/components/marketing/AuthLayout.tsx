import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, TrendingUp } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { AvatarStack } from '@/components/ui/AvatarStack';
import { users } from '@/mock-data';
import { transition } from '@/lib/motion';

const panelMembers = users.slice(2, 6);

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="dark flex min-h-screen bg-ink-950">
      <div className="relative flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-[46%] lg:px-16">
        <Link
          to="/"
          className="absolute left-6 top-8 inline-flex items-center gap-1.5 text-xs font-medium text-ink-400 transition-colors hover:text-ink-100 sm:left-12 lg:left-16"
        >
          <ArrowLeft size={13} />
          Back to Aureon
        </Link>

        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="mb-10 inline-flex">
            <Logo tone="light" />
          </Link>
          {children}
        </div>
      </div>

      <div className="relative hidden overflow-hidden border-l border-ink-800 bg-ink-900 lg:block lg:w-[54%]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-[520px] w-[520px] rounded-full bg-gold-500/15 blur-[130px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-[380px] w-[380px] rounded-full bg-info-500/10 blur-[120px]"
        />

        <div className="relative flex h-full flex-col justify-between p-14">
          <div />

          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition.slow, delay: 0.15 }}
              className="w-fit rounded-2xl border border-ink-700 bg-ink-850/90 p-5 shadow-raised backdrop-blur-xl"
            >
              <div className="flex items-center justify-between gap-8">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-ink-400">Project</p>
                  <p className="mt-0.5 text-sm font-medium text-ink-50">Project Aurora</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-success-500/30 bg-success-500/10 px-2 py-1 text-[10px] font-medium text-success-400">
                  On track
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <AvatarStack users={panelMembers} size="xs" max={4} />
                <div className="flex items-center gap-1 text-[11px] text-success-400">
                  <TrendingUp size={12} />
                  74%
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition.slow, delay: 0.3 }}
              className="ml-10 flex w-fit items-center gap-2.5 rounded-xl border border-ink-700 bg-ink-850/90 px-4 py-3 shadow-card backdrop-blur-xl"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-500/15 text-gold-400">
                <CheckCircle2 size={13} />
              </span>
              <p className="text-xs text-ink-200">Budget approval was granted</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition.slow, delay: 0.5 }}
              className="mt-4 max-w-sm"
            >
              <p className="text-2xl font-medium leading-snug tracking-tight text-ink-50">
                Where work <span className="font-serif italic text-gold-400">moves forward.</span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-400">
                Projects, people, workflows, and decisions — connected in one intelligent workspace.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
