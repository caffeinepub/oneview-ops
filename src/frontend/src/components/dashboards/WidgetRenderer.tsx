import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateDashboardMetrics, getRevenueMetrics, generateTrendData } from '../../data/sampleData';
import type { Widget } from '../../backend';
import { WidgetType } from '../../backend';
import type { FilterCriteria } from '../../utils/filters';
import { widgetLibrary } from '../../utils/dashboardWidgetLibrary';
import { 
  Phone, 
  Clock, 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp,
  Target,
  Calendar,
  Activity,
  Percent,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WidgetRendererProps {
  widget: Widget;
  filters: FilterCriteria;
}

const iconMap: Record<string, any> = {
  Phone,
  Clock,
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  Target,
  Calendar,
  Activity,
  Percent,
};

export default function WidgetRenderer({ widget, filters }: WidgetRendererProps) {
  const config = JSON.parse(widget.config);
  const widgetDef = widgetLibrary.find((w) => w.id === config.metricId);

  if (!widgetDef) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Unknown widget type</p>
        </CardContent>
      </Card>
    );
  }

  const metrics = generateDashboardMetrics(filters);
  const revenueMetrics = getRevenueMetrics(filters);

  // Calculate derived metrics
  const revenuePerRecruiter = revenueMetrics.activeRecruiters > 0 
    ? Math.round(revenueMetrics.revenue / revenueMetrics.activeRecruiters)
    : 0;

  const revenuePerHour = metrics.hours > 0 
    ? Math.round(revenueMetrics.revenue / metrics.hours)
    : 0;

  const callsPerPlacement = metrics.placements > 0 
    ? Math.round(metrics.calls / metrics.placements)
    : 0;

  const hoursPerHire = metrics.placements > 0 
    ? Math.round(metrics.hours / metrics.placements)
    : 0;

  const utilization = metrics.hours > 0 
    ? Math.round((metrics.hours / (revenueMetrics.activeRecruiters * 160)) * 100)
    : 0;

  // Map metric IDs to values
  const metricValues: Record<string, string | number> = {
    'total-calls': metrics.calls.toLocaleString(),
    'total-hours': Math.round(metrics.hours).toLocaleString(),
    'placements': metrics.placements.toLocaleString(),
    'interviews': metrics.interviews.toLocaleString(),
    'offers': metrics.offers.toLocaleString(),
    'revenue': `$${revenueMetrics.revenue.toLocaleString()}`,
    'margin': `$${Math.round(metrics.margin).toLocaleString()}`,
    'active-contractors': metrics.activeContractors.toLocaleString(),
    'revenue-per-recruiter': `$${revenuePerRecruiter.toLocaleString()}`,
    'revenue-per-hour': `$${revenuePerHour.toLocaleString()}`,
    'calls-per-placement': callsPerPlacement.toLocaleString(),
    'hours-per-hire': hoursPerHire.toLocaleString(),
    'time-to-fill': revenueMetrics.avgTimeToFill.toLocaleString(),
    'utilization': `${utilization}%`,
  };

  if (widget.widgetType === WidgetType.kpiCard) {
    const Icon = iconMap[config.icon] || Activity;
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {widgetDef.label}
          </CardTitle>
          <Icon className={`h-4 w-4 ${config.color || 'text-primary'}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metricValues[config.metricId] || '0'}</div>
        </CardContent>
      </Card>
    );
  }

  if (widget.widgetType === WidgetType.trendChart) {
    const trendData = generateTrendData(filters);
    return (
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>{widgetDef.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="placements" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  if (widget.widgetType === WidgetType.table) {
    return (
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>{widgetDef.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Table widget rendering coming soon
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
