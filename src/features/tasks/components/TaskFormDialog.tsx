import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, X } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Input, Label, Textarea } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { toast } from '@/components/ui/toast';
import { tasksService } from '@/services';
import { projects, users } from '@/mock-data';
import { STATUS_CONFIG, STATUS_ORDER } from '../task-status-config';
import type { Task } from '@/types';

const schema = z.object({
  title: z.string().min(2, 'Give the task a title'),
  description: z.string(),
  projectId: z.string().min(1, 'Choose a project'),
  assigneeId: z.string(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['planned', 'in-progress', 'review', 'completed']),
  dueDate: z.string().min(1, 'Pick a due date'),
});

type FormValues = z.infer<typeof schema>;

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  defaultStatus?: Task['status'];
  defaultProjectId?: string;
}

const UNASSIGNED = 'unassigned';

export function TaskFormDialog({ open, onOpenChange, task, defaultStatus, defaultProjectId }: TaskFormDialogProps) {
  const queryClient = useQueryClient();
  const [labels, setLabels] = useState<string[]>(task?.labels ?? []);
  const [labelDraft, setLabelDraft] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const isEdit = Boolean(task);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      projectId: task?.projectId ?? defaultProjectId ?? projects[0]?.id ?? '',
      assigneeId: task?.assigneeId ?? UNASSIGNED,
      priority: task?.priority ?? 'medium',
      status: task?.status ?? defaultStatus ?? 'planned',
      dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: task?.title ?? '',
        description: task?.description ?? '',
        projectId: task?.projectId ?? defaultProjectId ?? projects[0]?.id ?? '',
        assigneeId: task?.assigneeId ?? UNASSIGNED,
        priority: task?.priority ?? 'medium',
        status: task?.status ?? defaultStatus ?? 'planned',
        dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
      });
      setLabels(task?.labels ?? []);
      setLabelDraft('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, task]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const payload = {
        title: values.title,
        description: values.description,
        projectId: values.projectId,
        assigneeId: values.assigneeId === UNASSIGNED ? null : values.assigneeId,
        priority: values.priority,
        status: values.status,
        dueDate: new Date(values.dueDate).toISOString(),
        labels,
      };
      return isEdit ? tasksService.update(task!.id, payload) : tasksService.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success(isEdit ? 'Task updated' : 'Task created');
      onOpenChange(false);
    },
    onError: () => toast.error("Couldn't save task", 'Please try again.'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => tasksService.remove(task!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted');
      setConfirmDeleteOpen(false);
      onOpenChange(false);
    },
    onError: () => toast.error("Couldn't delete task", 'Please try again.'),
  });

  const addLabel = () => {
    const value = labelDraft.trim();
    if (value && !labels.includes(value)) setLabels((prev) => [...prev, value]);
    setLabelDraft('');
  };

  return (
    <>
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit task' : 'New task'}
      size="md"
      footer={
        <>
          {isEdit && (
            <Button
              variant="ghost"
              className="mr-auto text-danger-400 hover:bg-danger-500/10 hover:text-danger-400"
              onClick={() => setConfirmDeleteOpen(true)}
              icon={<Trash2 size={14} />}
            >
              Delete
            </Button>
          )}
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit((v) => mutation.mutate(v))} loading={isSubmitting || mutation.isPending}>
            {isEdit ? 'Save changes' : 'Create task'}
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit((v) => mutation.mutate(v))}>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="e.g. Review invoice PDF template" error={errors.title?.message} {...register('title')} />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Add more detail…" {...register('description')} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Project</Label>
            <Controller
              control={control}
              name="projectId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label>Assignee</Label>
            <Controller
              control={control}
              name="assigneeId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
          <div>
            <Label>Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_ORDER.map((status) => (
                      <SelectItem key={status} value={status}>
                        {STATUS_CONFIG[status].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label htmlFor="dueDate">Due date</Label>
            <Input id="dueDate" type="date" error={errors.dueDate?.message} {...register('dueDate')} />
          </div>
        </div>

        <div>
          <Label>Labels</Label>
          <div className="flex flex-wrap gap-1.5 rounded-lg border border-border-strong p-2">
            {labels.map((label) => (
              <span key={label} className="inline-flex items-center gap-1 rounded-full bg-surface-overlay px-2 py-1 text-[11px] text-text-secondary">
                {label}
                <button type="button" onClick={() => setLabels((prev) => prev.filter((l) => l !== label))}>
                  <X size={10} />
                </button>
              </span>
            ))}
            <input
              value={labelDraft}
              onChange={(e) => setLabelDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addLabel();
                }
              }}
              onBlur={addLabel}
              placeholder="Add label, press Enter"
              className="min-w-[120px] flex-1 bg-transparent px-1 py-1 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none"
            />
          </div>
        </div>
      </form>
    </Dialog>
    {isEdit && (
      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Delete task"
        description="This task will be permanently removed. This can't be undone."
        confirmLabel="Delete"
        tone="danger"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
      />
    )}
    </>
  );
}
