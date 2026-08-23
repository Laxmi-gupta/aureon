import { forwardRef } from 'react';
import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, error, ...props }, ref) => (
    <div className="w-full">
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'h-10 w-full rounded-lg border border-border-strong bg-surface px-3.5 text-sm text-text-primary placeholder:text-text-tertiary transition-colors duration-150 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20',
            icon && 'pl-10',
            error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20',
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-danger-400">{error}</p>}
    </div>
  ),
);
Input.displayName = 'Input';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <div className="w-full">
      <textarea
        ref={ref}
        className={cn(
          'min-h-24 w-full resize-y rounded-lg border border-border-strong bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary transition-colors duration-150 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20',
          error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20',
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-danger-400">{error}</p>}
    </div>
  ),
);
Textarea.displayName = 'Textarea';

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('mb-1.5 block text-xs font-medium text-text-secondary', className)}
      {...props}
    />
  );
}
