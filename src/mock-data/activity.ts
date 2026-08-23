import type { ActivityEvent } from '@/types';
import { daysFromNow, hoursFromNow } from './date-seed';

export const activityEvents: ActivityEvent[] = [
  { id: 'ac_1', actorId: 'u_dubois', verb: 'completed', targetType: 'task', targetLabel: 'Ship guided setup checklist', timestamp: hoursFromNow(-1) },
  { id: 'ac_2', actorId: 'u_chen', verb: 'submitted', targetType: 'approval', targetLabel: 'Contractor engagement — QA support', timestamp: hoursFromNow(-3) },
  { id: 'ac_3', actorId: 'u_novak', verb: 'moved to review', targetType: 'task', targetLabel: 'Interview 8 recently onboarded customers', timestamp: hoursFromNow(-4) },
  { id: 'ac_4', actorId: 'u_rivera', verb: 'reached 75% completion on', targetType: 'project', targetLabel: 'Project Aurora', meta: '74%', timestamp: hoursFromNow(-6) },
  { id: 'ac_5', actorId: 'u_kim', verb: 'approved', targetType: 'approval', targetLabel: 'MacBook Pro 16" — new hire equipment', timestamp: hoursFromNow(-7) },
  { id: 'ac_6', actorId: 'u_okafor', verb: 'commented on', targetType: 'task', targetLabel: 'Audit color contrast across dark theme', timestamp: hoursFromNow(-9) },
  { id: 'ac_7', actorId: 'u_ade', verb: 'requested changes on', targetType: 'approval', targetLabel: 'Travel budget increase — Sales team', timestamp: hoursFromNow(-11) },
  { id: 'ac_8', actorId: 'u_martins', verb: 'flagged', targetType: 'project', targetLabel: 'Meridian Expansion', meta: 'at risk', timestamp: daysFromNow(-1, 16, 20) },
  { id: 'ac_9', actorId: 'u_ferreira', verb: 'completed', targetType: 'task', targetLabel: 'Fix currency rounding bug', timestamp: daysFromNow(-1, 14, 10) },
  { id: 'ac_10', actorId: 'u_walker', verb: 'submitted', targetType: 'approval', targetLabel: 'Client dinner — Meridian kickoff', timestamp: daysFromNow(-1, 11, 45) },
  { id: 'ac_11', actorId: 'u_patel', verb: 'created', targetType: 'task', targetLabel: 'Migrate legacy invoices to new schema', timestamp: daysFromNow(-1, 9, 30) },
  { id: 'ac_12', actorId: 'u_larsson', verb: 'updated milestone on', targetType: 'project', targetLabel: 'Beacon Onboarding Revamp', meta: 'Guided setup flow', timestamp: daysFromNow(-2, 17, 5) },
  { id: 'ac_13', actorId: 'u_hassan', verb: 'submitted', targetType: 'approval', targetLabel: 'Conference travel — SaaS Summit Austin', timestamp: daysFromNow(-2, 13, 15) },
  { id: 'ac_14', actorId: 'u_johansson', verb: 'commented on', targetType: 'project', targetLabel: 'Helios Design System', timestamp: daysFromNow(-2, 10, 0) },
  { id: 'ac_15', actorId: 'u_chen', verb: 'approved', targetType: 'approval', targetLabel: 'Vendor renewal — analytics platform', timestamp: daysFromNow(-3, 15, 40) },
  { id: 'ac_16', actorId: 'u_kim', verb: 'assigned', targetType: 'task', targetLabel: 'Draft API contract with Northwind team', meta: 'to Jenny Kim', timestamp: daysFromNow(-3, 9, 20) },
  { id: 'ac_17', actorId: 'u_ade', verb: 'rejected', targetType: 'approval', targetLabel: 'Non-standard equipment — dual monitor arm', timestamp: daysFromNow(-4, 12, 0) },
  { id: 'ac_18', actorId: 'u_okafor', verb: 'completed', targetType: 'task', targetLabel: 'Ship new Button and Badge primitives', timestamp: daysFromNow(-4, 16, 30) },
  { id: 'ac_19', actorId: 'u_rivera', verb: 'created project', targetType: 'project', targetLabel: 'Northwind Integration', timestamp: daysFromNow(-8, 10, 0) },
  { id: 'ac_20', actorId: 'u_novak', verb: 'reached a milestone on', targetType: 'project', targetLabel: 'Project Aurora', meta: 'Usage metering pipeline', timestamp: daysFromNow(-12, 14, 0) },
  { id: 'ac_21', actorId: 'u_martins', verb: 'completed', targetType: 'task', targetLabel: 'Retire legacy reimbursement spreadsheet', timestamp: daysFromNow(-18, 11, 0) },
  { id: 'ac_22', actorId: 'u_chen', verb: 'closed out project', targetType: 'project', targetLabel: 'Catalyst Automation Suite', meta: '100%', timestamp: daysFromNow(-14, 9, 0) },
  { id: 'ac_23', actorId: 'u_larsson', verb: 'completed', targetType: 'task', targetLabel: 'Interview 8 recently onboarded customers', timestamp: hoursFromNow(-2) },
  { id: 'ac_24', actorId: 'u_dubois', verb: 'commented on', targetType: 'workflow', targetLabel: 'Expense Approval', timestamp: hoursFromNow(-5) },
  { id: 'ac_25', actorId: 'u_kim', verb: 'updated capacity for', targetType: 'team', targetLabel: 'Engineering', timestamp: daysFromNow(-1, 8, 15) },
];

export function activityForProject(projectName: string): ActivityEvent[] {
  return activityEvents.filter((event) => event.targetLabel === projectName);
}
