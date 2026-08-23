import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import type { TrendPoint } from '@/types';
import { ChartTooltip } from './ChartTooltip';

export function ThroughputChart({ data }: { data: TrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }} barCategoryGap="30%">
        <CartesianGrid vertical={false} stroke="var(--border-default)" strokeDasharray="3 4" />
        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
        <Tooltip
          content={<ChartTooltip suffix=" tasks/wk" />}
          cursor={{ fill: 'var(--surface-overlay)' }}
        />
        <Bar dataKey="value" fill="var(--color-gold-400)" radius={[4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
