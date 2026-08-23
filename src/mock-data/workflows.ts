import type { WorkflowTemplate } from '@/types';

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'wf_general',
    name: 'General Approval',
    description: 'A simple linear approval chain for one-off requests that need manager and finance sign-off.',
    category: 'General',
    accent: '#CEA254',
    usageCount: 214,
    avgCompletionHours: 18,
    nodes: [
      { id: 'n1', type: 'trigger', title: 'Request Submitted', position: { x: 60, y: 220 } },
      { id: 'n2', type: 'approval', title: 'Manager Review', assigneeRole: 'manager', position: { x: 360, y: 220 } },
      { id: 'n3', type: 'approval', title: 'Finance Approval', assigneeRole: 'administrator', position: { x: 660, y: 220 } },
      { id: 'n4', type: 'end', title: 'Completed', position: { x: 960, y: 220 } },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2' },
      { id: 'e2', source: 'n2', target: 'n3', label: 'Approved' },
      { id: 'e3', source: 'n3', target: 'n4', label: 'Approved' },
    ],
  },
  {
    id: 'wf_expense',
    name: 'Expense Approval',
    description: 'Routes expense claims to a manager, then escalates to finance only above the reimbursement threshold.',
    category: 'Finance',
    accent: '#3FA87D',
    usageCount: 486,
    avgCompletionHours: 14,
    nodes: [
      { id: 'n1', type: 'trigger', title: 'Expense Submitted', position: { x: 40, y: 260 } },
      { id: 'n2', type: 'approval', title: 'Manager Review', assigneeRole: 'manager', position: { x: 320, y: 260 } },
      { id: 'n3', type: 'condition', title: 'Amount over $1,000?', position: { x: 600, y: 260 } },
      { id: 'n4', type: 'approval', title: 'Finance Approval', assigneeRole: 'administrator', position: { x: 880, y: 120 } },
      { id: 'n5', type: 'end', title: 'Reimbursed', position: { x: 1160, y: 120 } },
      { id: 'n6', type: 'action', title: 'Auto-Reimbursed', position: { x: 880, y: 400 } },
      { id: 'n7', type: 'end', title: 'Rejected', position: { x: 320, y: 430 } },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2' },
      { id: 'e2', source: 'n2', target: 'n3', label: 'Approved' },
      { id: 'e3', source: 'n2', target: 'n7', label: 'Rejected' },
      { id: 'e4', source: 'n3', target: 'n4', label: 'Yes' },
      { id: 'e5', source: 'n3', target: 'n6', label: 'No' },
      { id: 'e6', source: 'n4', target: 'n5', label: 'Approved' },
    ],
  },
  {
    id: 'wf_leave',
    name: 'Leave Request',
    description: 'Time-off requests routed to a direct manager with automatic HR review for extended leave.',
    category: 'People',
    accent: '#5C85E6',
    usageCount: 337,
    avgCompletionHours: 9,
    nodes: [
      { id: 'n1', type: 'trigger', title: 'Leave Requested', position: { x: 40, y: 240 } },
      { id: 'n2', type: 'approval', title: 'Manager Review', assigneeRole: 'manager', position: { x: 320, y: 240 } },
      { id: 'n3', type: 'condition', title: 'Longer than 5 days?', position: { x: 600, y: 240 } },
      { id: 'n4', type: 'review', title: 'HR Review', assigneeRole: 'administrator', position: { x: 880, y: 120 } },
      { id: 'n5', type: 'end', title: 'Approved', position: { x: 1160, y: 180 } },
      { id: 'n6', type: 'end', title: 'Rejected', position: { x: 320, y: 400 } },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2' },
      { id: 'e2', source: 'n2', target: 'n3', label: 'Approved' },
      { id: 'e3', source: 'n2', target: 'n6', label: 'Rejected' },
      { id: 'e4', source: 'n3', target: 'n4', label: 'Yes' },
      { id: 'e5', source: 'n3', target: 'n5', label: 'No' },
      { id: 'e6', source: 'n4', target: 'n5', label: 'Approved' },
    ],
  },
  {
    id: 'wf_purchase',
    name: 'Purchase Request',
    description: 'Multi-stage procurement approval with department and budget-based finance escalation.',
    category: 'Procurement',
    accent: '#DD9A3F',
    usageCount: 162,
    avgCompletionHours: 27,
    nodes: [
      { id: 'n1', type: 'trigger', title: 'Purchase Requested', position: { x: 20, y: 260 } },
      { id: 'n2', type: 'approval', title: 'Dept. Head Review', assigneeRole: 'manager', position: { x: 280, y: 260 } },
      { id: 'n3', type: 'review', title: 'Procurement Review', position: { x: 540, y: 260 } },
      { id: 'n4', type: 'condition', title: 'Budget over $5,000?', position: { x: 800, y: 260 } },
      { id: 'n5', type: 'approval', title: 'Finance Approval', assigneeRole: 'administrator', position: { x: 1060, y: 120 } },
      { id: 'n6', type: 'end', title: 'Order Placed', position: { x: 1320, y: 180 } },
      { id: 'n7', type: 'action', title: 'Auto-Approved', position: { x: 1060, y: 400 } },
      { id: 'n8', type: 'end', title: 'Rejected', position: { x: 280, y: 430 } },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2' },
      { id: 'e2', source: 'n2', target: 'n3', label: 'Approved' },
      { id: 'e3', source: 'n2', target: 'n8', label: 'Rejected' },
      { id: 'e4', source: 'n3', target: 'n4' },
      { id: 'e5', source: 'n4', target: 'n5', label: 'Yes' },
      { id: 'e6', source: 'n4', target: 'n7', label: 'No' },
      { id: 'e7', source: 'n5', target: 'n6', label: 'Approved' },
      { id: 'e8', source: 'n7', target: 'n6' },
    ],
  },
];

export function getWorkflowTemplateById(id: string | null | undefined): WorkflowTemplate | undefined {
  if (!id) return undefined;
  return workflowTemplates.find((template) => template.id === id);
}
