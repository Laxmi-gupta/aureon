import { cn } from '@/lib/cn';

interface LogoProps {
  variant?: 'full' | 'mark';
  className?: string;
  /** 'light'/'dark' force the wordmark color for a background that never changes with the theme.
   *  'auto' (default) tracks the active theme — use it anywhere the surrounding panel is theme-aware. */
  tone?: 'light' | 'dark' | 'auto';
}

/**
 * Original Aureon mark — three ascending facets converging into a single
 * point, reading as both an "A" monogram and a momentum/ascent motif that
 * ties back to the "work has momentum" positioning.
 */
export function Logo({ variant = 'full', className, tone = 'auto' }: LogoProps) {
  const wordmarkColor = tone === 'light' ? 'text-ink-50' : tone === 'dark' ? 'text-ink-950' : 'text-text-primary';

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="aureon-mark-gradient" x1="4" y1="26" x2="28" y2="6" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#8A6631" />
            <stop offset="0.55" stopColor="#CEA254" />
            <stop offset="1" stopColor="#F2DDAC" />
          </linearGradient>
        </defs>
        <path d="M16 3L27 27H21.5L16 14.5L10.5 27H5L16 3Z" fill="url(#aureon-mark-gradient)" />
        <path d="M16 14.5L19.4 22H12.6L16 14.5Z" fill="#07080B" fillOpacity="0.55" />
      </svg>
      {variant === 'full' && (
        <span className={cn('text-[17px] font-semibold tracking-tight', wordmarkColor)}>Aureon</span>
      )}
    </span>
  );
}
