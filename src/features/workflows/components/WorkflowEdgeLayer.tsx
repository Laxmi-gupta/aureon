import { motion } from 'framer-motion';
import type { WorkflowEdge } from '@/types';
import { NODE_HEIGHT, NODE_WIDTH } from '../workflow-utils';
import { cn } from '@/lib/cn';

interface WorkflowEdgeLayerProps {
  edges: WorkflowEdge[];
  positions: Record<string, { x: number; y: number }>;
  activeEdgeKey: string | null;
  visitedEdgeKeys: Set<string>;
  width: number;
  height: number;
}

export function WorkflowEdgeLayer({ edges, positions, activeEdgeKey, visitedEdgeKeys, width, height }: WorkflowEdgeLayerProps) {
  return (
    <svg className="pointer-events-none absolute left-0 top-0" width={width} height={height}>
      <defs>
        <marker id="wf-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" className="fill-ink-400" />
        </marker>
        <marker id="wf-arrow-active" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" className="fill-gold-400" />
        </marker>
      </defs>
      {edges.map((edge) => {
        const source = positions[edge.source];
        const target = positions[edge.target];
        if (!source || !target) return null;

        const x1 = source.x + NODE_WIDTH;
        const y1 = source.y + NODE_HEIGHT / 2;
        const x2 = target.x;
        const y2 = target.y + NODE_HEIGHT / 2;
        const midX = (x1 + x2) / 2;
        const path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
        const cubic = (t: number) => {
          const mt = 1 - t;
          const cx =
            mt ** 3 * x1 + 3 * mt ** 2 * t * midX + 3 * mt * t ** 2 * midX + t ** 3 * x2;
          const cy = mt ** 3 * y1 + 3 * mt ** 2 * t * y1 + 3 * mt * t ** 2 * y2 + t ** 3 * y2;
          return { cx, cy };
        };
        const samples = [0, 0.25, 0.5, 0.75, 1].map(cubic);

        const key = `${edge.source}->${edge.target}`;
        const isActive = activeEdgeKey === key;
        const isVisited = visitedEdgeKeys.has(key);

        return (
          <g key={edge.id}>
            <path
              d={path}
              fill="none"
              strokeWidth={isActive ? 2.5 : 1.5}
              markerEnd={isActive ? 'url(#wf-arrow-active)' : 'url(#wf-arrow)'}
              className={cn(
                'transition-all duration-300',
                isActive ? 'stroke-gold-400' : isVisited ? 'stroke-ink-300' : 'stroke-ink-600',
              )}
              strokeDasharray={isActive ? undefined : '5 4'}
            />
            {isActive && (
              <motion.circle
                r={3.5}
                className="fill-gold-300"
                animate={{ cx: samples.map((s) => s.cx), cy: samples.map((s) => s.cy) }}
                transition={{ duration: 0.8, ease: 'linear' }}
              />
            )}
            {edge.label && (
              <foreignObject x={midX - 30} y={(y1 + y2) / 2 - 11} width={60} height={22}>
                <div
                  className={cn(
                    'flex h-full items-center justify-center rounded-full border px-1.5 text-center text-[9px] font-medium',
                    isActive ? 'border-gold-400/60 bg-ink-900 text-gold-300' : 'border-ink-600 bg-ink-900 text-ink-400',
                  )}
                >
                  {edge.label}
                </div>
              </foreignObject>
            )}
          </g>
        );
      })}
    </svg>
  );
}
