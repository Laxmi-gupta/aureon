import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageHeader } from '@/components/shared/PageHeader';
import { WorkflowTemplateCard } from './components/WorkflowTemplateCard';
import { workflowsService } from '@/services';
import { staggerContainer } from '@/lib/motion';

export function WorkflowsPage() {
  const { data: templates = [], isLoading } = useQuery({ queryKey: ['workflows'], queryFn: workflowsService.list });

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <PageHeader title="Workflows" description="Predefined approval flows, visualized and ready to run" />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[190px] rounded-2xl" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={staggerContainer(0.07)}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {templates.map((template) => (
            <WorkflowTemplateCard key={template.id} template={template} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
