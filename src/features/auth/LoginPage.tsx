import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Mail } from 'lucide-react';
import { AuthLayout } from '@/components/marketing/AuthLayout';
import { AuthHeading } from '@/components/marketing/AuthHeading';
import { Input, Label } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { toast } from '@/components/ui/toast';
import { authService } from '@/services';
import { useAuthStore } from '@/store/auth.store';

const schema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const [remember, setRemember] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });

  const onSubmit = async (values: FormValues) => {
    try {
      const session = await authService.login(values);
      setSession(session);
      toast.success('Welcome back', `Signed in as ${session.user.name}`);
      navigate('/app');
    } catch (error) {
      toast.error('Couldn\'t sign in', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  return (
    <AuthLayout>
      <AuthHeading title="Welcome back" description="Sign in to continue to your workspace." />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            icon={<Mail size={15} />}
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="mb-1.5">
              Password
            </Label>
            <Link to="/forgot-password" className="mb-1.5 text-xs font-medium text-gold-400 hover:text-gold-300">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            icon={<Lock size={15} />}
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <label className="mt-1 flex cursor-pointer items-center gap-2.5 text-xs text-ink-300">
          <Checkbox checked={remember} onCheckedChange={(v) => setRemember(v === true)} />
          Remember me on this device
        </label>

        <Button type="submit" size="lg" className="mt-2 w-full" loading={isSubmitting}>
          Sign in
        </Button>

        <p className="mt-1 text-center text-xs text-ink-500">
          Demo mode — any email works with a password of 6+ characters.
        </p>
      </form>

      <p className="mt-8 text-center text-sm text-ink-400">
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-gold-400 hover:text-gold-300">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
