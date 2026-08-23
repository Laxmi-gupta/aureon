import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, MailCheck } from 'lucide-react';
import { AuthLayout } from '@/components/marketing/AuthLayout';
import { AuthHeading } from '@/components/marketing/AuthHeading';
import { Input, Label } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/toast';
import { authService } from '@/services';
import { fadeUp } from '@/lib/motion';

const schema = z.object({
  email: z.email('Enter a valid email address'),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: '' } });

  const onSubmit = async (values: FormValues) => {
    try {
      await authService.requestPasswordReset(values.email);
      setSentTo(values.email);
    } catch (error) {
      toast.error("Couldn't send reset link", error instanceof Error ? error.message : 'Please try again.');
    }
  };

  if (sentTo) {
    return (
      <AuthLayout>
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <span className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-gold-500/10 text-gold-400">
            <MailCheck size={20} strokeWidth={1.75} />
          </span>
          <h1 className="text-2xl font-medium tracking-tight text-ink-50">Check your email</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-400">
            If an account exists for <span className="text-ink-200">{sentTo}</span>, we've sent a link to reset
            your password.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-gold-400 hover:text-gold-300"
          >
            <ArrowLeft size={14} />
            Back to login
          </Link>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthHeading title="Reset your password" description="Enter your email and we'll send you a reset link." />

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

        <Button type="submit" size="lg" className="mt-2 w-full" loading={isSubmitting}>
          Send reset link
        </Button>
      </form>

      <Link
        to="/login"
        className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-ink-400 hover:text-ink-100"
      >
        <ArrowLeft size={14} />
        Back to login
      </Link>
    </AuthLayout>
  );
}
