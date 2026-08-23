import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input, Label, Textarea } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { toast } from '@/components/ui/toast';
import { approvalsService } from '@/services';
import { workflowTemplates } from '@/mock-data';
import { useAuthStore } from '@/store/auth.store';

const schema = z.object({
  title: z.string().min(2, 'Give the request a title'),
  description: z.string().min(1, 'Add a short description'),
  workflowTemplateId: z.string().min(1, 'Choose a workflow'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  amount: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function NewApprovalRequestDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const queryClient = useQueryClient();
  const session = useAuthStore((s) => s.session);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '', workflowTemplateId: workflowTemplates[0]?.id ?? '', priority: 'medium', amount: '' },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const template = workflowTemplates.find((t) => t.id === values.workflowTemplateId);
      const stages = template
        ? template.nodes.filter((n) => n.type === 'approval' || n.type === 'review').map((n) => n.title)
        : ['Review'];
      return approvalsService.create({
        title: values.title,
        description: values.description,
        requesterId: session!.user.id,
        workflowTemplateId: values.workflowTemplateId,
        type: template?.category ?? 'General',
        priority: values.priority,
        stages,
        amount: values.amount ? Number(values.amount) : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      toast.success('Request submitted', "It's now in the approval queue.");
      onOpenChange(false);
      reset();
    },
    onError: () => toast.error("Couldn't submit request", 'Please try again.'),
  });

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="New approval request"
      description="Submit a request into an existing workflow."
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit((v) => mutation.mutate(v))} loading={isSubmitting || mutation.isPending}>
            Submit request
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit((v) => mutation.mutate(v))}>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="e.g. Conference travel — Q3 summit" error={errors.title?.message} {...register('title')} />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="What are you requesting and why?" error={errors.description?.message} {...register('description')} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Workflow</Label>
            <Controller
              control={control}
              name="workflowTemplateId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {workflowTemplates.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label>Priority</Label>
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="amount">Amount (optional)</Label>
          <Input id="amount" type="number" placeholder="0.00" {...register('amount')} />
        </div>
      </form>
    </Dialog>
  );
}
