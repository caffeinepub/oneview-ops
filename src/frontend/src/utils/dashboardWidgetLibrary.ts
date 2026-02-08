import { WidgetType } from '../backend';

export interface WidgetDefinition {
  id: string;
  label: string;
  description: string;
  widgetType: WidgetType;
  config: {
    metricId?: string;
    icon?: string;
    color?: string;
  };
}

export const widgetLibrary: WidgetDefinition[] = [
  {
    id: 'total-calls',
    label: 'Total Calls',
    description: 'Total number of calls made',
    widgetType: WidgetType.kpiCard,
    config: { metricId: 'total-calls', icon: 'Phone', color: 'text-blue-600' },
  },
  {
    id: 'total-hours',
    label: 'Total Hours Logged',
    description: 'Total hours logged by recruiters',
    widgetType: WidgetType.kpiCard,
    config: { metricId: 'total-hours', icon: 'Clock', color: 'text-purple-600' },
  },
  {
    id: 'placements',
    label: 'Placements',
    description: 'Total number of placements',
    widgetType: WidgetType.kpiCard,
    config: { metricId: 'placements', icon: 'Briefcase', color: 'text-green-600' },
  },
  {
    id: 'interviews',
    label: 'Interviews',
    description: 'Total number of interviews scheduled',
    widgetType: WidgetType.kpiCard,
    config: { metricId: 'interviews', icon: 'Users', color: 'text-amber-600' },
  },
  {
    id: 'offers',
    label: 'Offers',
    description: 'Total number of offers made',
    widgetType: WidgetType.kpiCard,
    config: { metricId: 'offers', icon: 'Target', color: 'text-teal-600' },
  },
  {
    id: 'revenue',
    label: 'Revenue',
    description: 'Total revenue generated',
    widgetType: WidgetType.kpiCard,
    config: { metricId: 'revenue', icon: 'DollarSign', color: 'text-emerald-600' },
  },
  {
    id: 'margin',
    label: 'Margin',
    description: 'Total margin (25% of revenue)',
    widgetType: WidgetType.kpiCard,
    config: { metricId: 'margin', icon: 'TrendingUp', color: 'text-indigo-600' },
  },
  {
    id: 'active-contractors',
    label: 'Active Contractors',
    description: 'Number of active contractors',
    widgetType: WidgetType.kpiCard,
    config: { metricId: 'active-contractors', icon: 'Users', color: 'text-cyan-600' },
  },
  {
    id: 'revenue-per-recruiter',
    label: 'Revenue per Recruiter',
    description: 'Average revenue per recruiter',
    widgetType: WidgetType.kpiCard,
    config: { metricId: 'revenue-per-recruiter', icon: 'DollarSign', color: 'text-green-600' },
  },
  {
    id: 'revenue-per-hour',
    label: 'Revenue per Hour',
    description: 'Revenue generated per hour worked',
    widgetType: WidgetType.kpiCard,
    config: { metricId: 'revenue-per-hour', icon: 'Clock', color: 'text-blue-600' },
  },
  {
    id: 'calls-per-placement',
    label: 'Calls per Placement',
    description: 'Average calls needed per placement',
    widgetType: WidgetType.kpiCard,
    config: { metricId: 'calls-per-placement', icon: 'Phone', color: 'text-purple-600' },
  },
  {
    id: 'hours-per-hire',
    label: 'Hours per Hire',
    description: 'Average hours needed per hire',
    widgetType: WidgetType.kpiCard,
    config: { metricId: 'hours-per-hire', icon: 'Activity', color: 'text-amber-600' },
  },
  {
    id: 'time-to-fill',
    label: 'Time-to-Fill (days)',
    description: 'Average days to fill a position',
    widgetType: WidgetType.kpiCard,
    config: { metricId: 'time-to-fill', icon: 'Calendar', color: 'text-rose-600' },
  },
  {
    id: 'utilization',
    label: 'Utilization %',
    description: 'Team utilization percentage',
    widgetType: WidgetType.kpiCard,
    config: { metricId: 'utilization', icon: 'Percent', color: 'text-teal-600' },
  },
  {
    id: 'placements-trend',
    label: 'Placements Trend',
    description: '12-month placement trend chart',
    widgetType: WidgetType.trendChart,
    config: { metricId: 'placements-trend' },
  },
];
