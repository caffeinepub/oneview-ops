import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendChartProps {
  data: Array<{ date: string; placements: number; calls: number; hours: number }>;
}

export default function TrendChart({ data }: TrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="placements" stroke="oklch(var(--chart-1))" strokeWidth={2} />
        <Line type="monotone" dataKey="calls" stroke="oklch(var(--chart-2))" strokeWidth={2} />
        <Line type="monotone" dataKey="hours" stroke="oklch(var(--chart-3))" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
