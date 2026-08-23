import type { AiSuggestion } from '@/types';
import { getUserById } from '@/mock-data';
import { createId } from '@/lib/id';
import { formatDueDate } from '@/lib/format';
import { withLatency } from './latency';
import { projectsService } from './projects.service';
import { tasksService } from './tasks.service';

/**
 * Simulated AI responses built from live mock data so they feel grounded
 * rather than generic. The interface is shaped so a real LLM call (e.g. to
 * the Claude API) can replace the body of each method without touching any
 * consuming component — only this file changes.
 */
export interface AiService {
  ask(prompt: string): Promise<AiSuggestion>;
  summarizeProjectActivity(projectId: string): Promise<AiSuggestion>;
  identifyOverdueWork(): Promise<AiSuggestion>;
  suggestPriorities(): Promise<AiSuggestion>;
  generateProjectSummary(projectId: string): Promise<AiSuggestion>;
}

function toSuggestion(prompt: string, response: string): AiSuggestion {
  return { id: createId('ai'), prompt, response, createdAt: new Date().toISOString() };
}

class MockAiService implements AiService {
  async ask(prompt: string): Promise<AiSuggestion> {
    const lower = prompt.toLowerCase();
    if (lower.includes('overdue')) return this.identifyOverdueWork();
    if (lower.includes('priorit')) return this.suggestPriorities();
    if (lower.includes('summar')) {
      const projects = await projectsService.list();
      const first = projects[0];
      if (first) return this.generateProjectSummary(first.id);
    }
    const tasks = await tasksService.list();
    const dueSoon = tasks.filter((t) => t.status !== 'completed').slice(0, 3);
    const response = [
      `Here's a quick read on where things stand: ${dueSoon.length} tasks need attention soon.`,
      ...dueSoon.map((t) => `— ${t.title}, due ${formatDueDate(t.dueDate)}`),
      '',
      'Ask me to summarize a project, find overdue work, or suggest what to prioritize next.',
    ].join('\n');
    return withLatency(toSuggestion(prompt, response), 900);
  }

  async summarizeProjectActivity(projectId: string): Promise<AiSuggestion> {
    const project = await projectsService.getById(projectId);
    if (!project) throw new Error('Project not found');
    const tasks = (await tasksService.list()).filter((t) => t.projectId === projectId);
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const owner = getUserById(project.ownerId);
    const response = [
      `${project.name} is ${project.progress}% complete and currently ${project.health.replace('-', ' ')}.`,
      `${completed} of ${tasks.length} tasks are done, led by ${owner?.name ?? 'the project owner'}.`,
      project.milestones.some((m) => !m.completed)
        ? `Next milestone: ${project.milestones.find((m) => !m.completed)?.title}.`
        : 'All milestones are complete.',
    ].join(' ');
    return withLatency(toSuggestion(`Summarize ${project.name}`, response), 900);
  }

  async identifyOverdueWork(): Promise<AiSuggestion> {
    const tasks = await tasksService.list();
    const overdue = tasks.filter((t) => t.status !== 'completed' && new Date(t.dueDate).getTime() < Date.now());
    const response = overdue.length
      ? [
          `${overdue.length} task${overdue.length === 1 ? ' is' : 's are'} overdue right now:`,
          ...overdue.slice(0, 6).map((t) => `— ${t.title} (${formatDueDate(t.dueDate)}, ${t.priority})`),
        ].join('\n')
      : 'Nothing is overdue right now — the team is on pace.';
    return withLatency(toSuggestion('Identify overdue work', response), 850);
  }

  async suggestPriorities(): Promise<AiSuggestion> {
    const tasks = await tasksService.list();
    const ranked = tasks
      .filter((t) => t.status !== 'completed')
      .sort((a, b) => {
        const weight = { urgent: 3, high: 2, medium: 1, low: 0 } as const;
        const priorityDelta = weight[b.priority] - weight[a.priority];
        if (priorityDelta !== 0) return priorityDelta;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      })
      .slice(0, 5);
    const response = [
      'Based on priority and deadline pressure, focus on these next:',
      ...ranked.map((t, i) => `${i + 1}. ${t.title} — ${t.priority}, due ${formatDueDate(t.dueDate)}`),
    ].join('\n');
    return withLatency(toSuggestion('Suggest task priorities', response), 900);
  }

  async generateProjectSummary(projectId: string): Promise<AiSuggestion> {
    return this.summarizeProjectActivity(projectId);
  }
}

export const aiService: AiService = new MockAiService();
