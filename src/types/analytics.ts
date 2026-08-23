export interface TrendPoint {
  label: string;
  value: number;
}

export interface AnalyticsSnapshot {
  projectCompletionRate: number;
  taskCompletionRate: number;
  avgTaskDurationDays: number;
  overdueCount: number;
  workflowEfficiency: number;
  completionTrend: TrendPoint[];
  workloadByMember: { userId: string; value: number }[];
  taskStatusBreakdown: { status: string; value: number }[];
  throughputByWeek: TrendPoint[];
}

export interface AiSuggestion {
  id: string;
  prompt: string;
  response: string;
  createdAt: string;
}
