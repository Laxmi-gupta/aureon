import { useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Eye, Flag, GitBranch, Play, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { WorkflowNode as WorkflowNodeType, WorkflowNodeType as NodeKind } from '@/types';
import { NODE_HEIGHT, NODE_WIDTH } from '../workflow-utils';
import { cn } from '@/lib/cn';

const NODE_STYLE: Record<NodeKind, { icon: LucideIcon; className: string }> = {
  trigger: { icon: Play, className: 'border-ink-500 bg-ink-800 text-ink-100' },
  approval: { icon: CheckCircle2, className: 'border-gold-500/40 bg-gold-500/10 text-gold-300' },
  review: { icon: Eye, className: 'border-info-500/40 bg-info-500/10 text-info-300' },
  action: { icon: Zap, className: 'border-success-500/40 bg-success-500/10 text-success-300' },
  condition: { icon: GitBranch, className: 'border-warning-500/40 bg-warning-500/10 text-warning-300' },
  end: { icon: Flag, className: 'border-ink-500 bg-ink-850 text-ink-200' },
};

interface WorkflowNodeCardProps {
  node: WorkflowNodeType;
  position: { x: number; y: number };
  isActive: boolean;
  isVisited: boolean;
  onDrag: (id: string, position: { x: number; y: number }) => void;
}

export function WorkflowNodeCard({ node, position, isActive, isVisited, onDrag }: WorkflowNodeCardProps) {
  const style = NODE_STYLE[node.type];
  const Icon = style.icon;
  const dragState = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);

  function handlePointerDown(event: ReactPointerEvent) {
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    dragState.current = { startX: event.clientX, startY: event.clientY, originX: position.x, originY: position.y };
  }

  function handlePointerMove(event: ReactPointerEvent) {
    if (!dragState.current) return;
    const dx = event.clientX - dragState.current.startX;
    const dy = event.clientY - dragState.current.startY;
    onDrag(node.id, { x: dragState.current.originX + dx, y: dragState.current.originY + dy });
  }

  function handlePointerUp() {
    dragState.current = null;
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="absolute cursor-grab select-none touch-none active:cursor-grabbing"
      style={{ left: position.x, top: position.y, width: NODE_WIDTH, height: NODE_HEIGHT }}
    >
      <motion.div
        animate={isActive ? { scale: [1, 1.04, 1] } : { scale: 1 }}
        transition={isActive ? { duration: 1.1, repeat: Infinity, ease: 'easeInOut' } : undefined}
        className={cn(
          'flex h-full flex-col justify-center gap-1.5 rounded-2xl border px-4 py-3 shadow-card backdrop-blur-sm transition-shadow',
          style.className,
          isActive && 'ring-2 ring-gold-400 shadow-glow-gold',
          isVisited && !isActive && 'opacity-80',
        )}
      >
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/20">
            <Icon size={12} />
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wide opacity-70">{node.type}</span>
        </div>
        <p className="text-[13px] font-medium leading-snug text-ink-50">{node.title}</p>
        {node.assigneeRole && <p className="text-[10px] capitalize opacity-60">{node.assigneeRole}</p>}
      </motion.div>
    </div>
  );
}
