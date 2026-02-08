import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { useOrgContext } from '../../state/orgContext';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import IntegrationSettingsPanel from './IntegrationSettingsPanel';

export default function LoxoIntegrationPage() {
  const navigate = useNavigate();
  const { orgConfig } = useOrgContext();
  const loxoIntegration = orgConfig.integrations.loxo;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/integrations' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold mb-2">Loxo ATS/CRM Integration</h1>
          <p className="text-muted-foreground">
            Manage your Loxo connection and sync settings
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Connection Settings</CardTitle>
            <CardDescription>
              Configure your Loxo integration and data sync preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IntegrationSettingsPanel integrationId="loxo" />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connection Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge variant={loxoIntegration.connected ? 'secondary' : 'outline'}>
                  {loxoIntegration.connected ? (
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Connected
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      Not Connected
                    </div>
                  )}
                </Badge>
              </div>
              {loxoIntegration.connected && (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Sync</span>
                    <span>2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Data Mode</span>
                    <span>{loxoIntegration.useSampleData ? 'Sample Data' : 'Live Data'}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Synced</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jobs</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Candidates</span>
                <span className="font-medium">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recruiters</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Placements</span>
                <span className="font-medium">42</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
