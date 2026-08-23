import type { WorkflowEdge, WorkflowNode } from '@/types';

const HAPPY_LABELS = ['approved', 'yes'];

/**
 * Walks the graph from its trigger node, preferring edges labeled with a
 * positive outcome ("Approved" / "Yes") at each branch, to produce the
 * "happy path" used for the run-through simulation.
 */
export function computeHappyPath(nodes: WorkflowNode[], edges: WorkflowEdge[]): string[] {
  const trigger = nodes.find((n) => n.type === 'trigger');
  if (!trigger) return [];

  const path: string[] = [trigger.id];
  const visited = new Set([trigger.id]);
  let current = trigger.id;

  while (true) {
    const outgoing = edges.filter((e) => e.source === current);
    if (outgoing.length === 0) break;

    const preferred =
      outgoing.find((e) => e.label && HAPPY_LABELS.includes(e.label.toLowerCase())) ?? outgoing[0];
    if (!preferred || visited.has(preferred.target)) break;

    path.push(preferred.target);
    visited.add(preferred.target);
    current = preferred.target;
  }

  return path;
}

export const NODE_WIDTH = 208;
export const NODE_HEIGHT = 88;

export function nodeCenter(position: { x: number; y: number }) {
  return { x: position.x + NODE_WIDTH / 2, y: position.y + NODE_HEIGHT / 2 };
}
