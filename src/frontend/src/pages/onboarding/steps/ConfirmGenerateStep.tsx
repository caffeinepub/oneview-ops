import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Building2, Users, Database, Link as LinkIcon } from 'lucide-react';
import { useOrgContext } from '../../../state/orgContext';

export default function ConfirmGenerateStep() {
  const { orgConfig } = useOrgContext();

  const orgTypeLabel = orgConfig.orgType === 'staffing' ? 'Staffing Agency' : 'Internal Talent Acquisition';
  const OrgIcon = orgConfig.orgType === 'staffing' ? Building2 : Users;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Ready to Generate Your Dashboards</h3>
        <p className="text-sm text-muted-foreground">
          Review your configuration below. Your role-based dashboards will be generated automatically.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <OrgIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Organization Type</p>
            <p className="font-semibold">{orgTypeLabel}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Database className="h-4 w-4 text-muted-foreground" />
            <p className="font-semibold text-sm">Connected Integrations</p>
          </div>
          <div className="space-y-2">
            {orgConfig.integrations.loxo.connected && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">Loxo ATS/CRM</span>
                <Badge variant="secondary" className="text-xs ml-auto">
                  {orgConfig.integrations.loxo.useSampleData ? 'Sample Data' : 'Connected'}
                </Badge>
              </div>
            )}
            {orgConfig.integrations.aircall.connected && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">Aircall</span>
                <Badge variant="secondary" className="text-xs ml-auto">
                  {orgConfig.integrations.aircall.useSampleData ? 'Sample Data' : 'Connected'}
                </Badge>
              </div>
            )}
            {orgConfig.integrations.timesheets.connected && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">Timesheets ({orgConfig.integrations.timesheets.provider})</span>
                <Badge variant="secondary" className="text-xs ml-auto">
                  {orgConfig.integrations.timesheets.useSampleData ? 'Sample Data' : 'Connected'}
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-2">
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
            <p className="font-semibold text-sm">User Mapping</p>
          </div>
          <p className="text-sm text-muted-foreground">
            5 users automatically mapped across systems
          </p>
        </div>
      </Card>

      <Card className="p-4 bg-accent/50 border-accent">
        <p className="text-sm">
          <span className="font-semibold">Next:</span> Click "Complete Setup" to generate your personalized dashboards
          and start analyzing your hiring data.
        </p>
      </Card>
    </div>
  );
}
