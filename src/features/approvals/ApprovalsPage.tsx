import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckCircle2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { ApprovalRow } from './components/ApprovalRow';
import { ApprovalDetailDrawer } from './components/ApprovalDetailDrawer';
import { NewApprovalRequestDialog } from './components/NewApprovalRequestDialog';
import { approvalsService } from '@/services';
import { staggerContainer } from '@/lib/motion';
import type { ApprovalRequest } from '@/types';

export function ApprovalsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState<ApprovalRequest | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { data: approvals = [], isLoading } = useQuery({ queryKey: ['approvals'], queryFn: approvalsService.list });

  useEffect(() => {
    if (searchParams.get('create') === '1') {
      setCreateOpen(true);
      searchParams.delete('create');
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pending = approvals.filter((a) => a.status === 'pending' || a.status === 'changes-requested');
  const approved = approvals.filter((a) => a.status === 'approved');
  const rejected = approvals.filter((a) => a.status === 'rejected');

  const selectedLive = selected ? approvals.find((a) => a.id === selected.id) ?? null : null;

  function renderList(items: ApprovalRequest[]) {
    if (isLoading) {
      return (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[76px] rounded-2xl" />
          ))}
        </div>
      );
    }
    if (items.length === 0) {
      return <EmptyState icon={CheckCircle2} title="Nothing here" description="Requests will show up in this tab as they move through review." />;
    }
    return (
      <motion.div variants={staggerContainer(0.05)} initial="hidden" animate="visible" className="flex flex-col gap-3">
        {items.map((approval) => (
          <ApprovalRow key={approval.id} approval={approval} onClick={() => setSelected(approval)} />
        ))}
      </motion.div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[1000px] flex-col gap-6">
      <PageHeader
        title="Approvals"
        description={`${pending.length} requests waiting on a decision`}
        action={
          <Button onClick={() => setCreateOpen(true)} icon={<Plus size={15} />}>
            New request
          </Button>
        }
      />

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-5">
          {renderList(pending)}
        </TabsContent>
        <TabsContent value="approved" className="mt-5">
          {renderList(approved)}
        </TabsContent>
        <TabsContent value="rejected" className="mt-5">
          {renderList(rejected)}
        </TabsContent>
      </Tabs>

      <ApprovalDetailDrawer approval={selectedLive} onOpenChange={(open) => !open && setSelected(null)} />
      <NewApprovalRequestDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
