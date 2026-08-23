import { differenceInCalendarDays, format, formatDistanceToNowStrict, isToday, isTomorrow, isYesterday } from 'date-fns';

export function formatDate(iso: string, pattern = 'MMM d, yyyy'): string {
  return format(new Date(iso), pattern);
}

export function formatDueDate(iso: string): string {
  const date = new Date(iso);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d');
}

export function formatRelativeTime(iso: string): string {
  return `${formatDistanceToNowStrict(new Date(iso))} ago`;
}

export function daysUntil(iso: string): number {
  return differenceInCalendarDays(new Date(iso), new Date());
}

export function isOverdue(iso: string): boolean {
  return daysUntil(iso) < 0;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}
