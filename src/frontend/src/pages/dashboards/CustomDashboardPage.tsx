import { useNavigate, useParams } from '@tanstack/react-router';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { useGetDashboard } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGlobalFilters } from '../../hooks/useGlobalFilters';
import GlobalFilterBar from '../../components/filters/GlobalFilterBar';
import WidgetRenderer from '../../components/dashboards/WidgetRenderer';

export default function CustomDashboardPage() {
  const navigate = useNavigate();
  const { dashboardId } = useParams({ strict: false }) as { dashboardId: string };
  const { identity } = useInternetIdentity();
  const { filters } = useGlobalFilters();

  const { data: dashboard, isLoading, error } = useGetDashboard(BigInt(dashboardId));

  const isOwner = dashboard && identity && dashboard.owner.toString() === identity.getPrincipal().toString();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard Not Found</h1>
            <p className="text-muted-foreground">
              The dashboard you're looking for doesn't exist or you don't have access to it.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-2">{dashboard.name}</h1>
            <p className="text-muted-foreground">
              {dashboard.widgets.length} widget{dashboard.widgets.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        {isOwner && (
          <Button variant="outline" disabled>
            <Edit className="mr-2 h-4 w-4" />
            Edit (Coming Soon)
          </Button>
        )}
      </div>

      <GlobalFilterBar />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dashboard.widgets.map((widget) => (
          <WidgetRenderer key={Number(widget.id)} widget={widget} filters={filters} />
        ))}
      </div>
    </div>
  );
}
