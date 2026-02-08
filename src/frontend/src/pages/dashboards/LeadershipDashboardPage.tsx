import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TrendingUp, Users, DollarSign, Clock, Briefcase, Target } from 'lucide-react';
import { useGlobalFilters } from '../../hooks/useGlobalFilters';
import { useOrgContext } from '../../state/orgContext';
import { generateDashboardMetrics, generateFunnelData, generateTrendData, getRevenueMetrics } from '../../data/sampleData';
import { computeAllMetrics } from '../../utils/metrics';
import { formatCurrency, formatNumber, safeDivide } from '../../utils/formatting';
import GlobalFilterBar from '../../components/filters/GlobalFilterBar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

export default function LeadershipDashboardPage() {
  const { filters } = useGlobalFilters();
  const { orgConfig } = useOrgContext();
  
  const isStaffingAgency = orgConfig.orgType === 'staffing';
  const metrics = generateDashboardMetrics(filters);
  const computedMetrics = computeAllMetrics(filters);
  const funnelData = generateFunnelData(filters);
  const trendData = generateTrendData(filters);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Leadership Dashboard</h1>
        <p className="text-muted-foreground">
          Funnel health, revenue velocity, and recruiter ROI
        </p>
      </div>

      <GlobalFilterBar />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Placements</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.placements}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.interviews} interviews, {metrics.offers} offers
            </p>
          </CardContent>
        </Card>

        {isStaffingAgency ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(metrics.revenue)}</div>
                <p className="text-xs text-muted-foreground">
                  Margin: {formatCurrency(metrics.margin)}
                </p>
              </CardContent>
            </Card>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="cursor-help">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Revenue per Hour</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {computedMetrics.revenuePerHour !== null 
                          ? formatCurrency(computedMetrics.revenuePerHour)
                          : '—'}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Efficiency metric
                      </p>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Revenue efficiency: dollars earned per hour worked</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        ) : (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="cursor-help">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Time-to-Fill</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {computedMetrics.timeToFill !== null 
                          ? `${computedMetrics.timeToFill.toFixed(0)} days`
                          : '—'}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Average days to hire
                      </p>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Average days from job opening to placement</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Recruiters</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.activeRecruiters}</div>
                <p className="text-xs text-muted-foreground">
                  Team members
                </p>
              </CardContent>
            </Card>
          </>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contractors</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeContractors}</div>
            <p className="text-xs text-muted-foreground">
              Currently placed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="cursor-help">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Calls per Placement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {computedMetrics.callsPerPlacement !== null 
                      ? safeDivide(computedMetrics.callsPerPlacement, 1, 1)
                      : '—'}
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>Average number of calls required to make a placement</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="cursor-help">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Hours per Hire</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {computedMetrics.hoursPerHire !== null 
                      ? `${computedMetrics.hoursPerHire.toFixed(1)}h`
                      : '—'}
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>Average hours invested per successful hire</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {isStaffingAgency && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="cursor-help">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Revenue per Recruiter</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {computedMetrics.revenuePerRecruiter !== null 
                        ? formatCurrency(computedMetrics.revenuePerRecruiter)
                        : '—'}
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Average revenue generated per recruiter</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Funnel</CardTitle>
            <CardDescription>Conversion rates through each stage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="value" fill="oklch(0.65 0.15 200)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Outcome Trend</CardTitle>
            <CardDescription>Placements over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Line type="monotone" dataKey="placements" stroke="oklch(0.65 0.15 200)" strokeWidth={2} />
                <Line type="monotone" dataKey="calls" stroke="oklch(0.65 0.15 160)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
