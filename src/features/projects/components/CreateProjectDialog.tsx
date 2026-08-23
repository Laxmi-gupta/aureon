import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input, Label, Textarea } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Avatar } from '@/components/ui/Avatar';
import { toast } from '@/components/ui/toast';
import { projectsService } from '@/services';
import { AVATAR_COLORS, users } from '@/mock-data';
import { useAuthStore } from '@/store/auth.store';
import type { Priority } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Give the project a name'),
  description: z.string().min(1, 'Add a short description'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  deadline: z.string().min(1, 'Pick a deadline'),
});

type FormValues = z.infer<typeof schema>;

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const session = useAuthStore((s) => s.session);
  const [memberIds, setMemberIds] = useState<string[]>(session?.user ? [session.user.id] : []);
  const [accent, setAccent] = useState<string>(AVATAR_COLORS[0]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', priority: 'medium', deadline: '' },
  });

  const createMutation = useMutation({
    mutationFn: projectsService.create,
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created', `${project.name} is ready to go.`);
      onOpenChange(false);
      reset();
      navigate(`/app/projects/${project.id}`);
    },
    onError: () => toast.error("Couldn't create project", 'Please try again.'),
  });

  const onSubmit = (values: FormValues) => {
    if (!session?.user) return;
    createMutation.mutate({
      name: values.name,
      description: values.description,
      priority: values.priority as Priority,
      ownerId: session.user.id,
      memberIds: memberIds.length ? memberIds : [session.user.id],
      startDate: new Date().toISOString(),
      deadline: new Date(values.deadline).toISOString(),
      accent,
      tags: [],
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="New project"
      description="Set up a project workspace for your team."
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} loading={isSubmitting}>
            Create project
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="name">Project name</Label>
          <Input id="name" placeholder="e.g. Meridian Expansion" error={errors.name?.message} {...register('name')} />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="What is this project about?"
            error={errors.description?.message}
            {...register('description')}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <Label htmlFor="deadline">Deadline</Label>
            <Input id="deadline" type="date" error={errors.deadline?.message} {...register('deadline')} />
          </div>
        </div>

        <div>
          <Label>Accent color</Label>
          <div className="flex gap-2">
            {AVATAR_COLORS.map((color) => (
              <button
                type="button"
                key={color}
                onClick={() => setAccent(color)}
                className="flex h-7 w-7 items-center justify-center rounded-full ring-offset-2 ring-offset-surface-raised transition-shadow"
                style={{ backgroundColor: color, boxShadow: accent === color ? `0 0 0 2px ${color}` : undefined }}
                aria-label={`Select ${color}`}
              />
            ))}
          </div>
        </div>

        <div>
          <Label>Team members</Label>
          <div className="max-h-40 overflow-y-auto rounded-lg border border-border-strong p-2">
            {users.map((user) => (
              <label
                key={user.id}
                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-surface-overlay"
              >
                <Checkbox
                  checked={memberIds.includes(user.id)}
                  onCheckedChange={(checked) =>
                    setMemberIds((prev) => (checked ? [...prev, user.id] : prev.filter((id) => id !== user.id)))
                  }
                />
                <Avatar name={user.name} color={user.color} size="xs" />
                <span className="text-xs text-text-secondary">{user.name}</span>
              </label>
            ))}
          </div>
        </div>
      </form>
    </Dialog>
  );
}
