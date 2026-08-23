import { FileStack } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export function ProjectFilesTab() {
  return (
    <EmptyState
      icon={FileStack}
      title="File attachments are coming soon"
      description="Attach specs, briefs, and assets directly to this project. This surface is wired up for the next release."
      action={
        <Button size="sm" variant="secondary" disabled className="mt-2">
          Upload files
        </Button>
      }
    />
  );
}
