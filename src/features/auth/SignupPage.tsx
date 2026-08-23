import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Mail, User } from 'lucide-react';
import { AuthLayout } from '@/components/marketing/AuthLayout';
import { AuthHeading } from '@/components/marketing/AuthHeading';
import { Input, Label } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { toast } from '@/components/ui/toast';
import { authService } from '@/services';
import { useAuthStore } from '@/store/auth.store';

const schema = z
  .object({
    name: z.string().min(2, 'Enter your full name'),
    email: z.email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export function SignupPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const [agreed, setAgreed] = useState(false);
  const [agreedError, setAgreedError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: FormValues) => {
    if (!agreed) {
      setAgreedError(true);
      return;
    }
    try {
      const session = await authService.signup(values);
      setSession(session);
      toast.success('Account created', `Welcome to Aureon, ${session.user.name.split(' ')[0]}`);
      navigate('/app');
    } catch (error) {
      toast.error("Couldn't create account", error instanceof Error ? error.message : 'Please try again.');
    }
  };

  return (
    <AuthLayout>
      <AuthHeading title="Create your account" description="Set up your workspace in under a minute." />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            placeholder="Jordan Ellis"
            icon={<User size={15} />}
            error={errors.name?.message}
            {...register('name')}
          />
        </div>

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
          <Label htmlFor="password">Password</Label>
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
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            icon={<Lock size={15} />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        <div>
          <label className="mt-1 flex cursor-pointer items-start gap-2.5 text-xs text-ink-300">
            <Checkbox
              checked={agreed}
              onCheckedChange={(v) => {
                setAgreed(v === true);
                if (v === true) setAgreedError(false);
              }}
              className="mt-0.5"
            />
            I agree to the Terms of Service and Privacy Policy
          </label>
          {agreedError && <p className="mt-1.5 text-xs text-danger-400">Please accept the terms to continue.</p>}
        </div>

        <Button type="submit" size="lg" className="mt-2 w-full" loading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-gold-400 hover:text-gold-300">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
