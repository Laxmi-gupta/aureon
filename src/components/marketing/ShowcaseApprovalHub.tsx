import { motion } from 'framer-motion';
import { Check, Clock, FileCheck2 } from 'lucide-react';
import { Container } from './Container';
import { SectionHeading } from './SectionHeading';
import { Avatar } from '@/components/ui/Avatar';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { approvals, getUserById } from '@/mock-data';
import { formatCurrency } from '@/lib/format';
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';

const queue = approvals.filter((a) => a.status === 'pending').slice(0, 4);
const detail = approvals.find((a) => a.id === 'a_2')!;

const STEPS = [
  { label: 'Submitted', done: true },
  { label: 'Dept. Head Review', done: true },
  { label: 'Procurement Review', done: true },
  { label: 'Finance Approval', done: false },
];

export function ShowcaseApprovalHub() {
  return (
    <section className="border-t border-ink-800 bg-ink-950 py-24 sm:py-32">
      <Container className="grid gap-14 lg:grid-cols-2 lg:gap-10">
        <div className="order-2 lg:order-1">
          <div className="rounded-2xl border border-ink-700 bg-ink-900/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-ink-50">
                <FileCheck2 size={15} className="text-gold-400" />
                {detail.title}
              </div>
              <span className="text-xs font-mono text-ink-300">{formatCurrency(detail.amount ?? 0)}</span>
            </div>
            <p className="mt-1.5 text-xs text-ink-400">
              Requested by {getUserById(detail.requesterId)?.name} · {detail.type}
            </p>

            <div className="mt-6 flex flex-col gap-0">
              {STEPS.map((step, index) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.4, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="flex gap-3"
                >
                  <div className="flex flex-col items-center">
                    <span
                      className={
                        step.done
                          ? 'flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success-500 text-ink-950'
                          : 'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ink-600 text-ink-400'
                      }
                    >
                      {step.done ? <Check size={12} strokeWidth={3} /> : <Clock size={11} />}
                    </span>
                    {index < STEPS.length - 1 && (
                      <span className={`my-0.5 h-8 w-px ${step.done ? 'bg-success-500/50' : 'bg-ink-700'}`} />
                    )}
                  </div>
                  <p className={`pb-6 text-sm ${step.done ? 'text-ink-100' : 'text-ink-400'}`}>{step.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <SectionHeading
            eyebrow="Approval Hub"
            title="Approvals that don't stall in someone's inbox."
            description="Every request carries its full history — who reviewed it, when, and what's next — so nothing waits on a status-check email."
          />

          <motion.div
            variants={staggerContainer(0.1, 0.15)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mt-8 flex flex-col gap-2.5"
          >
            {queue.map((approval) => {
              const requester = getUserById(approval.requesterId);
              return (
                <motion.div
                  key={approval.id}
                  variants={fadeUp}
                  className="flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-900/40 p-3.5"
                >
                  {requester && <Avatar name={requester.name} color={requester.color} size="sm" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-ink-100">{approval.title}</p>
                    <p className="text-[11px] text-ink-400">{approval.currentStage}</p>
                  </div>
                  <PriorityBadge priority={approval.priority} />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
