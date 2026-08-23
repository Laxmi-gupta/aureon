import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Repeat } from 'lucide-react';
import type { WorkflowTemplate } from '@/types';
import { Card } from '@/components/ui/Card';
import { fadeUp } from '@/lib/motion';

export function WorkflowTemplateCard({ template }: { template: WorkflowTemplate }) {
  const navigate = useNavigate();
  const stageCount = template.nodes.filter((n) => n.type !== 'trigger' && n.type !== 'end').length;

  return (
    <motion.div variants={fadeUp}>
      <Card
        interactive
        onClick={() => navigate(`/app/workflows/${template.id}`)}
        className="flex h-full cursor-pointer flex-col p-5"
      >
        <div className="flex items-start justify-between">
          <span className="rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ backgroundColor: `${template.accent}1a`, color: template.accent }}>
            {template.category}
          </span>
          <ArrowRight size={15} className="text-text-tertiary" />
        </div>

        <h3 className="mt-3 text-[15px] font-medium text-text-primary">{template.name}</h3>
        <p className="mt-1.5 flex-1 text-xs leading-relaxed text-text-tertiary">{template.description}</p>

        <div className="mt-4 flex items-center gap-2 text-[11px] text-text-tertiary">
          {Array.from({ length: stageCount }).map((_, i) => (
            <span key={i} className="h-1 flex-1 rounded-full" style={{ backgroundColor: `${template.accent}40` }} />
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border-default pt-3 text-[11px] text-text-tertiary">
          <span className="inline-flex items-center gap-1">
            <Repeat size={11} />
            {template.usageCount} runs
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock size={11} />
            ~{template.avgCompletionHours}h avg
          </span>
        </div>
      </Card>
    </motion.div>
  );
}
