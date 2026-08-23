import { useMemo, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import type { WorkflowTemplate } from '@/types';
import { Button } from '@/components/ui/Button';
import { WorkflowNodeCard } from './WorkflowNode';
import { WorkflowEdgeLayer } from './WorkflowEdgeLayer';
import { computeHappyPath, NODE_HEIGHT, NODE_WIDTH } from '../workflow-utils';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function WorkflowCanvas({ template }: { template: WorkflowTemplate }) {
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(() =>
    Object.fromEntries(template.nodes.map((n) => [n.id, n.position])),
  );
  const [activeIndex, setActiveIndex] = useState(-1);
  const [simulating, setSimulating] = useState(false);

  const happyPath = useMemo(() => computeHappyPath(template.nodes, template.edges), [template]);
  const activeNodeId = activeIndex >= 0 ? happyPath[activeIndex] : null;
  const visitedIds = new Set(happyPath.slice(0, Math.max(activeIndex, 0)));
  const activeEdgeKey =
    activeIndex > 0 ? `${happyPath[activeIndex - 1]}->${happyPath[activeIndex]}` : null;
  const visitedEdgeKeys = new Set(
    happyPath.slice(0, Math.max(activeIndex, 0)).map((id, i, arr) => (i > 0 ? `${arr[i - 1]}->${id}` : '')).filter(Boolean),
  );

  const bounds = useMemo(() => {
    const xs = Object.values(positions).map((p) => p.x + NODE_WIDTH);
    const ys = Object.values(positions).map((p) => p.y + NODE_HEIGHT);
    return { width: Math.max(...xs, 0) + 60, height: Math.max(...ys, 0) + 60 };
  }, [positions]);

  async function runSimulation() {
    if (simulating || happyPath.length === 0) return;
    setSimulating(true);
    for (let i = 0; i < happyPath.length; i++) {
      setActiveIndex(i);
      await sleep(950);
    }
    await sleep(600);
    setSimulating(false);
    setActiveIndex(-1);
  }

  function reset() {
    setActiveIndex(-1);
    setSimulating(false);
  }

  const activeNode = template.nodes.find((n) => n.id === activeNodeId);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-default bg-surface-raised px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span className="h-2 w-2 rounded-full bg-accent" />
          {simulating && activeNode ? (
            <span>
              Currently at <span className="font-medium text-text-primary">{activeNode.title}</span>
            </span>
          ) : (
            <span>Ready to simulate the happy path</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={reset} disabled={simulating} icon={<RotateCcw size={13} />}>
            Reset
          </Button>
          <Button size="sm" onClick={runSimulation} loading={simulating} icon={<Play size={13} />}>
            Run simulation
          </Button>
        </div>
      </div>

      <div className="dark relative overflow-auto rounded-2xl border border-ink-700 bg-ink-950 bg-[radial-gradient(circle,var(--color-ink-700)_1px,transparent_1px)] [background-size:22px_22px]">
        <div className="relative" style={{ width: bounds.width, height: bounds.height, minWidth: '100%' }}>
          <WorkflowEdgeLayer
            edges={template.edges}
            positions={positions}
            activeEdgeKey={activeEdgeKey}
            visitedEdgeKeys={visitedEdgeKeys}
            width={bounds.width}
            height={bounds.height}
          />
          {template.nodes.map((node) => (
            <WorkflowNodeCard
              key={node.id}
              node={node}
              position={positions[node.id] ?? node.position}
              isActive={activeNodeId === node.id}
              isVisited={visitedIds.has(node.id)}
              onDrag={(id, pos) => setPositions((prev) => ({ ...prev, [id]: pos }))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
