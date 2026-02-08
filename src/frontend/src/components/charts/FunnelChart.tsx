import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface FunnelChartProps {
  data: Array<{ stage: string; count: number }>;
}

export default function FunnelChart({ data }: FunnelChartProps) {
  const colors = ['oklch(var(--chart-1))', 'oklch(var(--chart-2))', 'oklch(var(--chart-3))', 'oklch(var(--chart-4))'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="stage" type="category" width={100} />
        <Tooltip />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
