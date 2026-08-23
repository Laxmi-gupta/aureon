import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-text-primary">{title}</h1>
        {description && <p className="mt-1 text-sm text-text-tertiary">{description}</p>}
      </div>
      {action}
    </div>
  );
}
