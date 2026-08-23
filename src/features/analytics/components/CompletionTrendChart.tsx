import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import type { TrendPoint } from '@/types';
import { ChartTooltip } from './ChartTooltip';

export function CompletionTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="completionFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-gold-400)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-gold-400)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border-default)" strokeDasharray="3 4" />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
        />
        <Tooltip content={<ChartTooltip suffix=" tasks" />} cursor={{ stroke: 'var(--border-strong)', strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--color-gold-400)"
          strokeWidth={2}
          fill="url(#completionFill)"
          activeDot={{ r: 4, fill: 'var(--color-gold-400)', stroke: 'var(--surface-raised)', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
