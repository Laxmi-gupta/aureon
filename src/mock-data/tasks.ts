import type { Priority, Task, TaskStatus } from '@/types';
import { daysFromNow } from './date-seed';

const STATUS_CYCLE: TaskStatus[] = ['planned', 'in-progress', 'review', 'completed', 'in-progress', 'completed'];
const PRIORITY_CYCLE: Priority[] = ['medium', 'high', 'low', 'urgent', 'medium', 'high'];

interface Seed {
  title: string;
  description: string;
  projectId: string;
  assigneeId: string | null;
  labels: string[];
  dueOffset: number;
  statusOverride?: TaskStatus;
  priorityOverride?: Priority;
}

const seeds: Seed[] = [
  // Project Aurora
  { title: 'Design real-time invoice preview', description: 'Live-updating invoice preview as usage metrics stream in.', projectId: 'p_aurora', assigneeId: 'u_dubois', labels: ['Design', 'Billing'], dueOffset: 0 },
  { title: 'Implement usage metering webhook', description: 'Emit metering events to the pricing engine on every billable action.', projectId: 'p_aurora', assigneeId: 'u_novak', labels: ['Backend', 'API'], dueOffset: -2 },
  { title: 'Migrate legacy invoices to new schema', description: 'Backfill script for historical invoice records.', projectId: 'p_aurora', assigneeId: 'u_patel', labels: ['Infra'], dueOffset: 5 },
  { title: 'QA pricing tier edge cases', description: 'Validate proration logic across plan up/downgrades mid-cycle.', projectId: 'p_aurora', assigneeId: 'u_ferreira', labels: ['QA'], dueOffset: 3 },
  { title: 'Write billing API documentation', description: 'Public docs for the new usage-based billing endpoints.', projectId: 'p_aurora', assigneeId: 'u_novak', labels: ['Docs'], dueOffset: 10 },
  { title: 'Review invoice PDF template', description: 'Finance sign-off on the redesigned invoice layout.', projectId: 'p_aurora', assigneeId: 'u_rivera', labels: ['Design'], dueOffset: 1 },
  { title: 'Fix currency rounding bug', description: 'Sub-cent rounding drift on JPY and other zero-decimal currencies.', projectId: 'p_aurora', assigneeId: 'u_kim', labels: ['Bug', 'Backend'], dueOffset: -1 },

  // Meridian Expansion
  { title: 'Finalize GDPR data processing addendum', description: 'Legal review of the DPA for EU customer contracts.', projectId: 'p_meridian', assigneeId: 'u_ade', labels: ['Compliance'], dueOffset: -3 },
  { title: 'Localize onboarding copy into French & German', description: 'Translate and adapt onboarding flow copy for two priority markets.', projectId: 'p_meridian', assigneeId: 'u_hassan', labels: ['Copy'], dueOffset: 2 },
  { title: 'Set regional pricing bands', description: 'Purchasing-power adjusted pricing for EMEA rollout.', projectId: 'p_meridian', assigneeId: 'u_walker', labels: ['Planning'], dueOffset: 6 },
  { title: 'Audit VAT handling in checkout', description: 'Confirm VAT calculation matches regional requirements.', projectId: 'p_meridian', assigneeId: 'u_martins', labels: ['Compliance', 'Bug'], dueOffset: 0 },
  { title: 'Coordinate EMEA launch comms', description: 'Draft internal and external announcement plan.', projectId: 'p_meridian', assigneeId: 'u_hassan', labels: ['Planning'], dueOffset: 8 },

  // Helios Design System
  { title: 'Ship new Button and Badge primitives', description: 'Finalize variants, states, and Framer Motion interactions.', projectId: 'p_helios', assigneeId: 'u_dubois', labels: ['Design', 'Frontend'], dueOffset: -1, statusOverride: 'completed' },
  { title: 'Audit color contrast across dark theme', description: 'WCAG AA pass on all semantic color tokens.', projectId: 'p_helios', assigneeId: 'u_okafor', labels: ['Design', 'QA'], dueOffset: 4 },
  { title: 'Publish component documentation site', description: 'Interactive docs with live prop tables and usage examples.', projectId: 'p_helios', assigneeId: 'u_johansson', labels: ['Docs'], dueOffset: 12 },
  { title: 'Build motion guideline reference', description: 'Codify easing curves and durations for the whole team.', projectId: 'p_helios', assigneeId: 'u_okafor', labels: ['Design'], dueOffset: 9 },
  { title: 'Migrate marketing site to token system', description: 'Replace hardcoded values with design tokens.', projectId: 'p_helios', assigneeId: 'u_dubois', labels: ['Frontend'], dueOffset: 15 },

  // Northwind Integration
  { title: 'Draft API contract with Northwind team', description: 'Define sync payloads for purchase orders and vendors.', projectId: 'p_northwind', assigneeId: 'u_kim', labels: ['API', 'Planning'], dueOffset: 3 },
  { title: 'Prototype vendor record sync', description: 'One-way sync of vendor master data as a spike.', projectId: 'p_northwind', assigneeId: 'u_patel', labels: ['Backend'], dueOffset: 11 },
  { title: 'Set up sandbox environment', description: 'Isolated sandbox for integration testing against Northwind staging.', projectId: 'p_northwind', assigneeId: 'u_ferreira', labels: ['Infra'], dueOffset: 7 },

  // Beacon Onboarding Revamp
  { title: 'Ship guided setup checklist', description: 'Progressive checklist replacing the old static onboarding doc.', projectId: 'p_beacon', assigneeId: 'u_dubois', labels: ['Design', 'Frontend'], dueOffset: -1, statusOverride: 'completed' },
  { title: 'Build time-to-value dashboard', description: 'Track activation milestones per account cohort.', projectId: 'p_beacon', assigneeId: 'u_larsson', labels: ['Frontend'], dueOffset: 0 },
  { title: 'Interview 8 recently onboarded customers', description: 'Qualitative research on onboarding friction points.', projectId: 'p_beacon', assigneeId: 'u_walker', labels: ['Research'], dueOffset: -4, statusOverride: 'review' },
  { title: 'Reduce setup wizard from 9 steps to 5', description: 'Consolidate redundant configuration steps.', projectId: 'p_beacon', assigneeId: 'u_larsson', labels: ['Design'], dueOffset: 2 },

  // Catalyst (completed project, mostly done tasks)
  { title: 'Roll out approval routing to all departments', description: 'Company-wide enablement of the new routing engine.', projectId: 'p_catalyst', assigneeId: 'u_chen', labels: ['Planning'], dueOffset: -20, statusOverride: 'completed' },
  { title: 'Retire legacy reimbursement spreadsheet', description: 'Decommission the manual finance tracking sheet.', projectId: 'p_catalyst', assigneeId: 'u_martins', labels: ['Infra'], dueOffset: -18, statusOverride: 'completed' },

  // Solstice Data Migration
  { title: 'Map legacy schema to warehouse model', description: 'Field-by-field mapping doc for the migration.', projectId: 'p_solstice', assigneeId: 'u_kim', labels: ['Data'], dueOffset: -6, statusOverride: 'completed' },
  { title: 'Run pipeline dry run on staging', description: 'Validate transform logic against a staging snapshot.', projectId: 'p_solstice', assigneeId: 'u_novak', labels: ['Infra'], dueOffset: 18 },

  // Cross-cutting / unassigned backlog
  { title: 'Evaluate SOC 2 Type II readiness', description: 'Gap analysis ahead of the annual security audit.', projectId: 'p_meridian', assigneeId: null, labels: ['Compliance'], dueOffset: 25 },
  { title: 'Refresh Q3 team capacity plan', description: 'Reforecast team capacity against upcoming roadmap.', projectId: 'p_aurora', assigneeId: 'u_rivera', labels: ['Planning'], dueOffset: 14 },
];

function buildTask(seed: Seed, index: number): Task {
  const status = seed.statusOverride ?? STATUS_CYCLE[index % STATUS_CYCLE.length]!;
  const priority = seed.priorityOverride ?? PRIORITY_CYCLE[index % PRIORITY_CYCLE.length]!;
  return {
    id: `t_${index + 1}`,
    title: seed.title,
    description: seed.description,
    projectId: seed.projectId,
    assigneeId: seed.assigneeId,
    priority,
    status,
    dueDate: daysFromNow(seed.dueOffset),
    labels: seed.labels,
    createdAt: daysFromNow(seed.dueOffset - 21),
    updatedAt: daysFromNow(Math.min(seed.dueOffset, -1)),
  };
}

export const tasks: Task[] = seeds.map(buildTask);

export function getTaskById(id: string | null | undefined): Task | undefined {
  if (!id) return undefined;
  return tasks.find((task) => task.id === id);
}
