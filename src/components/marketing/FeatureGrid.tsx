import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Bot,
  CheckSquare,
  FolderKanban,
  LineChart,
  MessagesSquare,
  Users2,
  Workflow,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Container } from './Container';
import { SectionHeading } from './SectionHeading';
import { fadeUp, viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/cn';

function Tile({
  icon: Icon,
  title,
  description,
  visual,
  className,
  delay = 0,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  visual: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/50 p-6 transition-colors duration-300 hover:border-ink-500',
        className,
      )}
    >
      <div className="relative z-10">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/10 text-gold-400">
          <Icon size={16} strokeWidth={1.75} />
        </span>
        <h3 className="mt-4 text-[15px] font-medium text-ink-50">{title}</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-400">{description}</p>
      </div>
      <div className="relative z-10 mt-auto flex flex-1 items-end pt-6">{visual}</div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.div>
  );
}

function ProjectVisual() {
  return (
    <div className="w-full space-y-2.5">
      {[74, 52, 88].map((value, i) => (
        <div key={i} className="flex items-center gap-2.5">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-700">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${value}%` }}
              viewport={viewportOnce}
              transition={{ duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-300"
            />
          </div>
          <span className="font-mono text-[10px] text-ink-400">{value}%</span>
        </div>
      ))}
    </div>
  );
}

function WorkflowVisual() {
  return (
    <div className="flex w-full items-center justify-between">
      {['Request', 'Review', 'Done'].map((label, i, arr) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border-2 border-gold-400 bg-ink-900" />
            <span className="text-[9px] text-ink-400">{label}</span>
          </div>
          {i < arr.length - 1 && (
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, delay: i * 0.25 + 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ originX: 0 }}
              className="mx-1.5 h-px w-8 bg-gold-400/60 sm:w-10"
            />
          )}
        </div>
      ))}
    </div>
  );
}

function ApprovalVisual() {
  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0, rotate: -8 }}
      whileInView={{ scale: 1, opacity: 1, rotate: -4 }}
      viewport={viewportOnce}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-success-500/40 bg-success-500/10 px-2.5 py-1.5"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-success-400" />
      <span className="text-[11px] font-medium text-success-400">Approved</span>
    </motion.div>
  );
}

function CollaborationVisual() {
  const colors = ['#CEA254', '#5C85E6', '#3FA87D'];
  return (
    <div className="flex -space-x-2">
      {colors.map((color, i) => (
        <motion.span
          key={color}
          initial={{ y: 8, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-medium text-ink-950 ring-2 ring-ink-900"
          style={{ backgroundColor: color }}
        >
          {String.fromCharCode(65 + i)}
        </motion.span>
      ))}
      <span className="ml-3 flex items-center text-[10px] text-ink-400">
        <MessagesSquare size={11} className="mr-1" /> 3 replies
      </span>
    </div>
  );
}

function InsightsVisual() {
  return (
    <div className="flex items-end gap-1.5">
      {[40, 65, 45, 80, 55, 70].map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: h * 0.4 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="w-2 rounded-t bg-gold-400/70"
        />
      ))}
    </div>
  );
}

function ActivityVisual() {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-success-400" />
      </span>
      <span className="text-[11px] text-ink-300">Sarah completed a review — just now</span>
    </div>
  );
}

function AnalyticsVisual() {
  return (
    <svg viewBox="0 0 200 50" className="h-14 w-full">
      <motion.path
        d="M0 40 L30 30 L60 34 L90 18 L120 22 L150 8 L200 14"
        fill="none"
        stroke="#CEA254"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

function AiVisual() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-gold-400"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
        />
      ))}
      <span className="ml-2 text-[11px] text-ink-400">Summarizing project activity…</span>
    </div>
  );
}

const FEATURES = [
  { icon: FolderKanban, title: 'Project Management', description: 'Track health, ownership, and milestones without a status meeting.', visual: <ProjectVisual />, span: 'lg:col-span-2 lg:row-span-2' },
  { icon: Workflow, title: 'Smart Workflows', description: 'Route requests through the right people, automatically.', visual: <WorkflowVisual />, span: 'lg:col-span-2' },
  { icon: CheckSquare, title: 'Approval Management', description: 'Decisions with full context and a permanent history.', visual: <ApprovalVisual />, span: '' },
  { icon: MessagesSquare, title: 'Task Collaboration', description: 'Comments and updates live where the work happens.', visual: <CollaborationVisual />, span: '' },
  { icon: Users2, title: 'Team Insights', description: 'Understand capacity before it becomes a bottleneck.', visual: <InsightsVisual />, span: '' },
  { icon: Activity, title: 'Real-time Activity', description: 'A live pulse of everything moving across the org.', visual: <ActivityVisual />, span: '' },
  { icon: LineChart, title: 'Business Analytics', description: 'Completion rates, throughput, and efficiency trends.', visual: <AnalyticsVisual />, span: 'lg:col-span-2' },
  { icon: Bot, title: 'AI Assistance', description: 'Ask Aureon to summarize, prioritize, or flag risk.', visual: <AiVisual />, span: '' },
];

export function FeatureGrid() {
  return (
    <section id="features" className="border-t border-ink-800 bg-ink-950 py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Everything, in one system"
          title="A platform built for how operations teams actually work."
          description="Eight surfaces, one shared source of truth — no context lost moving between them."
          align="center"
          className="mx-auto"
        />

        <motion.div
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[190px]"
        >
          {FEATURES.map((feature) => (
            <Tile
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              visual={feature.visual}
              className={feature.span}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
