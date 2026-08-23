interface ChartTooltipProps {
  active?: boolean;
  label?: string;
  payload?: { value: number; name?: string }[];
  suffix?: string;
}

export function ChartTooltip({ active, label, payload, suffix = '' }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-border-strong bg-surface-raised px-3 py-2 text-xs shadow-raised">
      <p className="font-medium text-text-primary">{label}</p>
      <p className="mt-0.5 font-mono text-text-secondary">
        {payload[0]?.value}
        {suffix}
      </p>
    </div>
  );
}
