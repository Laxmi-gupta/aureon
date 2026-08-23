import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Clock, Repeat, Workflow } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { workflowsService } from '@/services';

export function WorkflowBuilderPage() {
  const { templateId } = useParams();
  const { data: templates = [], isLoading } = useQuery({ queryKey: ['workflows'], queryFn: workflowsService.list });
  const template = templates.find((t) => t.id === templateId);

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-[1300px] flex-col gap-5">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[520px] rounded-2xl" />
      </div>
    );
  }

  if (!template) {
    return (
      <EmptyState
        icon={Workflow}
        title="Workflow not found"
        action={
          <Link to="/app/workflows" className="mt-2 text-sm font-medium text-accent hover:text-accent-strong">
            Back to workflows
          </Link>
        }
      />
    );
  }

  return (
    <div className="mx-auto flex max-w-[1300px] flex-col gap-5">
      <Link to="/app/workflows" className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-text-tertiary hover:text-text-primary">
        <ArrowLeft size={13} />
        All workflows
      </Link>

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-medium"
            style={{ backgroundColor: `${template.accent}1a`, color: template.accent }}
          >
            {template.category}
          </span>
          <h1 className="mt-2 text-2xl font-medium tracking-tight text-text-primary">{template.name}</h1>
          <p className="mt-1 max-w-xl text-sm text-text-tertiary">{template.description}</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-text-tertiary">
          <span className="inline-flex items-center gap-1.5">
            <Repeat size={13} />
            {template.usageCount} runs
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={13} />
            ~{template.avgCompletionHours}h avg
          </span>
        </div>
      </div>

      <WorkflowCanvas template={template} />
    </div>
  );
}
