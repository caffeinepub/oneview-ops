import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Settings, ExternalLink } from 'lucide-react';
import { useOrgContext } from '../../state/orgContext';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import ManageIntegrationDrawer from './ManageIntegrationDrawer';

export default function IntegrationsPage() {
  const navigate = useNavigate();
  const { orgConfig } = useOrgContext();
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);

  const integrations = [
    {
      id: 'loxo',
      name: 'Loxo ATS/CRM',
      description: 'Jobs, Candidates, Recruiters, Pipeline stages, Placements, Fees',
      connected: orgConfig.integrations.loxo.connected,
      lastSync: '2 hours ago',
      hasDetailPage: true,
    },
    {
      id: 'aircall',
      name: 'Aircall',
      description: 'Calls, Duration, Direction, User mapping',
      connected: orgConfig.integrations.aircall.connected,
      lastSync: '1 hour ago',
      hasDetailPage: false,
    },
    {
      id: 'timesheets',
      name: 'Timesheets',
      description: 'Logged hours, billable vs non-billable, recruiter mapping',
      connected: orgConfig.integrations.timesheets.connected,
      lastSync: '30 minutes ago',
      hasDetailPage: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Integrations</h1>
        <p className="text-muted-foreground">
          Manage your connected systems and data sources
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {integration.name}
                    {integration.connected ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {integration.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={integration.connected ? 'secondary' : 'outline'}>
                  {integration.connected ? 'Connected' : 'Not Connected'}
                </Badge>
              </div>
              {integration.connected && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Sync</span>
                  <span>{integration.lastSync}</span>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedIntegration(integration.id)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Manage
                </Button>
                {integration.hasDetailPage && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate({ to: `/integrations/${integration.id}` })}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedIntegration && (
        <ManageIntegrationDrawer
          integrationId={selectedIntegration}
          onClose={() => setSelectedIntegration(null)}
        />
      )}
    </div>
  );
}
