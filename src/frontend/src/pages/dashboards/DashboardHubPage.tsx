import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserRole, useIsCallerAdmin, useGetAllDashboards } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  Activity, 
  Sparkles, 
  ArrowRight, 
  Plus,
  TrendingUp,
  AlertCircle,
  FileText,
  Trophy,
  Gauge,
} from 'lucide-react';
import PrototypeAIGeneratorPanel from './PrototypeAIGeneratorPanel';

export default function DashboardHubPage() {
  const navigate = useNavigate();
  const { data: userRole } = useGetCallerUserRole();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: customDashboards = [], isLoading: dashboardsLoading } = useGetAllDashboards();

  const dashboards = [
    {
      title: 'All Metrics',
      description: 'Comprehensive overview of all KPIs and metrics',
      icon: Gauge,
      path: '/dashboard/all-metrics',
      roles: ['admin', 'user'],
    },
    {
      title: 'Leadership Dashboard',
      description: 'Funnel health, productivity vs outcome, revenue metrics',
      icon: BarChart3,
      path: '/dashboard/leadership',
      roles: ['admin', 'user'],
    },
    {
      title: 'Recruiter Dashboard',
      description: 'Calls, hours, pipeline movement, placements',
      icon: Users,
      path: '/dashboard/recruiter',
      roles: ['admin', 'user'],
    },
    {
      title: 'Ops/HR Dashboard',
      description: 'Utilization, burnout risk, data gaps',
      icon: Activity,
      path: '/dashboard/ops',
      roles: ['admin', 'user'],
    },
  ];

  const analysisViews = [
    {
      title: 'Funnel Analysis',
      description: 'Calls-hours-outcomes correlation and conversion metrics',
      icon: TrendingUp,
      path: '/analysis/funnel',
      roles: ['admin', 'user'],
    },
    {
      title: 'Data Health',
      description: 'Data quality scores and issue tracking',
      icon: AlertCircle,
      path: '/data-health',
      roles: ['admin', 'user'],
    },
    {
      title: 'Alerts & Insights',
      description: 'Automated alerts and actionable insights',
      icon: AlertCircle,
      path: '/alerts',
      roles: ['admin', 'user'],
    },
    {
      title: 'Leaderboards',
      description: 'Team performance rankings and goal tracking',
      icon: Trophy,
      path: '/leaderboards',
      roles: ['admin', 'user'],
    },
  ];

  const reportsViews = [
    {
      title: 'Reports & Exports',
      description: 'Generate and export custom reports',
      icon: FileText,
      path: '/reports',
      roles: ['admin', 'user'],
    },
  ];

  const visibleDashboards = dashboards.filter((dashboard) => {
    if (isAdmin) return true;
    return dashboard.roles.includes(userRole || 'guest');
  });

  const visibleAnalysis = analysisViews.filter((view) => {
    if (isAdmin) return true;
    return view.roles.includes(userRole || 'guest');
  });

  const visibleReports = reportsViews.filter((view) => {
    if (isAdmin) return true;
    return view.roles.includes(userRole || 'guest');
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Reports & Dashboards</h1>
        <p className="text-muted-foreground">
          Access pre-built dashboards, analysis tools, and custom views
        </p>
      </div>

      <Tabs defaultValue="dashboards" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboards" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleDashboards.map((dashboard) => {
              const Icon = dashboard.icon;
              return (
                <Card
                  key={dashboard.path}
                  className="cursor-pointer hover:border-primary transition-all hover:shadow-md"
                  onClick={() => navigate({ to: dashboard.path })}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Icon className="h-8 w-8 text-primary" />
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardTitle className="mt-4">{dashboard.title}</CardTitle>
                    <CardDescription>{dashboard.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleAnalysis.map((view) => {
              const Icon = view.icon;
              return (
                <Card
                  key={view.path}
                  className="cursor-pointer hover:border-primary transition-all hover:shadow-md"
                  onClick={() => navigate({ to: view.path })}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Icon className="h-8 w-8 text-primary" />
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardTitle className="mt-4">{view.title}</CardTitle>
                    <CardDescription>{view.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleReports.map((view) => {
              const Icon = view.icon;
              return (
                <Card
                  key={view.path}
                  className="cursor-pointer hover:border-primary transition-all hover:shadow-md"
                  onClick={() => navigate({ to: view.path })}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Icon className="h-8 w-8 text-primary" />
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardTitle className="mt-4">{view.title}</CardTitle>
                    <CardDescription>{view.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Dashboards</CardTitle>
              <CardDescription>
                Create and manage your personalized dashboard views
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate({ to: '/dashboard/custom/new' })}>
                <Plus className="mr-2 h-4 w-4" />
                Create Custom Dashboard
              </Button>
            </CardContent>
          </Card>

          {dashboardsLoading ? (
            <div className="text-center text-muted-foreground py-8">Loading dashboards...</div>
          ) : customDashboards.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {customDashboards.map((dashboard) => (
                <Card
                  key={Number(dashboard.id)}
                  className="cursor-pointer hover:border-primary transition-all hover:shadow-md"
                  onClick={() => navigate({ to: `/dashboard/custom/${dashboard.id}` })}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <BarChart3 className="h-8 w-8 text-primary" />
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardTitle className="mt-4">{dashboard.name}</CardTitle>
                    <CardDescription>{dashboard.widgets.length} widgets</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No custom dashboards yet. Create your first one!
            </div>
          )}

          <Card className="border-2 border-dashed">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>Prototype AI Dashboard Generator</CardTitle>
              </div>
              <CardDescription>
                Generate custom dashboards from plain English queries (no external AI required)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PrototypeAIGeneratorPanel />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
