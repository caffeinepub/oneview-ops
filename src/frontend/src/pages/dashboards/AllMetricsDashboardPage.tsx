import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateDashboardMetrics, getRevenueMetrics } from '../../data/sampleData';
import { useGlobalFilters } from '../../hooks/useGlobalFilters';
import GlobalFilterBar from '../../components/filters/GlobalFilterBar';
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

export default function AllMetricsDashboardPage() {
  const { filters } = useGlobalFilters();

  const metrics = generateDashboardMetrics(filters);
  const revenueMetrics = getRevenueMetrics(filters);

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

  const kpiCards = [
    {
      title: 'Total Calls',
      value: metrics.calls.toLocaleString(),
      icon: Phone,
      color: 'text-blue-600',
    },
    {
      title: 'Total Hours Logged',
      value: Math.round(metrics.hours).toLocaleString(),
      icon: Clock,
      color: 'text-purple-600',
    },
    {
      title: 'Placements',
      value: metrics.placements.toLocaleString(),
      icon: Briefcase,
      color: 'text-green-600',
    },
    {
      title: 'Interviews',
      value: metrics.interviews.toLocaleString(),
      icon: Users,
      color: 'text-amber-600',
    },
    {
      title: 'Offers',
      value: metrics.offers.toLocaleString(),
      icon: Target,
      color: 'text-teal-600',
    },
    {
      title: 'Revenue',
      value: `$${revenueMetrics.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-emerald-600',
    },
    {
      title: 'Margin',
      value: `$${Math.round(metrics.margin).toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-indigo-600',
    },
    {
      title: 'Active Contractors',
      value: metrics.activeContractors.toLocaleString(),
      icon: Users,
      color: 'text-cyan-600',
    },
    {
      title: 'Revenue per Recruiter',
      value: `$${revenuePerRecruiter.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Revenue per Hour',
      value: `$${revenuePerHour.toLocaleString()}`,
      icon: Clock,
      color: 'text-blue-600',
    },
    {
      title: 'Calls per Placement',
      value: callsPerPlacement.toLocaleString(),
      icon: Phone,
      color: 'text-purple-600',
    },
    {
      title: 'Hours per Hire',
      value: hoursPerHire.toLocaleString(),
      icon: Activity,
      color: 'text-amber-600',
    },
    {
      title: 'Time-to-Fill (days)',
      value: revenueMetrics.avgTimeToFill.toLocaleString(),
      icon: Calendar,
      color: 'text-rose-600',
    },
    {
      title: 'Utilization %',
      value: `${utilization}%`,
      icon: Percent,
      color: 'text-teal-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">All Metrics Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive overview of all key performance indicators
        </p>
      </div>

      <GlobalFilterBar />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
