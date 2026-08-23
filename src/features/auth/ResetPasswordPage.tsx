import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock } from 'lucide-react';
import { AuthLayout } from '@/components/marketing/AuthLayout';
import { AuthHeading } from '@/components/marketing/AuthHeading';
import { Input, Label } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/toast';
import { authService } from '@/services';
import { fadeUp } from '@/lib/motion';

const schema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Confirm your new password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [done, setDone] = useState(false);
  const token = searchParams.get('token') ?? 'demo-token';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { password: '', confirmPassword: '' } });

  const onSubmit = async (values: FormValues) => {
    try {
      await authService.resetPassword(token, values.password);
      setDone(true);
    } catch (error) {
      toast.error("Couldn't reset password", error instanceof Error ? error.message : 'Please try again.');
    }
  };

  if (done) {
    return (
      <AuthLayout>
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <span className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-success-500/10 text-success-400">
            <CheckCircle2 size={20} strokeWidth={1.75} />
          </span>
          <h1 className="text-2xl font-medium tracking-tight text-ink-50">Password updated</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-400">
            Your password has been reset. You can now sign in with your new password.
          </p>
          <Button size="lg" className="mt-8 w-full" onClick={() => navigate('/login')}>
            Continue to login
          </Button>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthHeading title="Set a new password" description="Choose a new password for your account." />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <div>
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            icon={<Lock size={15} />}
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            icon={<Lock size={15} />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        <Button type="submit" size="lg" className="mt-2 w-full" loading={isSubmitting}>
          Reset password
        </Button>
      </form>
    </AuthLayout>
  );
}
