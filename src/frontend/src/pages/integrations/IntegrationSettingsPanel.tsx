import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { useOrgContext } from '../../state/orgContext';
import { toast } from 'sonner';

interface IntegrationSettingsPanelProps {
  integrationId: string;
}

export default function IntegrationSettingsPanel({ integrationId }: IntegrationSettingsPanelProps) {
  const { orgConfig, updateOrgConfig } = useOrgContext();
  const integration = orgConfig.integrations[integrationId as keyof typeof orgConfig.integrations];
  
  const [useSampleData, setUseSampleData] = useState(integration?.useSampleData ?? true);
  const [apiKey, setApiKey] = useState('');

  const handleSave = () => {
    updateOrgConfig({
      integrations: {
        ...orgConfig.integrations,
        [integrationId]: {
          ...integration,
          connected: true,
          apiKey: useSampleData ? 'sample' : apiKey,
          useSampleData,
        },
      },
    });
    toast.success('Integration updated successfully');
  };

  const handleDisconnect = () => {
    updateOrgConfig({
      integrations: {
        ...orgConfig.integrations,
        [integrationId]: {
          ...integration,
          connected: false,
          apiKey: undefined,
        },
      },
    });
    toast.success('Integration disconnected');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <Label htmlFor="sample-data" className="font-semibold">Use Sample Data</Label>
          <p className="text-sm text-muted-foreground">
            Perfect for testing and demos
          </p>
        </div>
        <Switch
          id="sample-data"
          checked={useSampleData}
          onCheckedChange={setUseSampleData}
        />
      </div>

      {!useSampleData && (
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <Input
            id="api-key"
            type="password"
            placeholder="Enter API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
      )}

      <div className="flex gap-3">
        <Button onClick={handleSave} className="flex-1">
          {integration?.connected ? 'Save Changes' : 'Connect'}
        </Button>
        {integration?.connected && (
          <Button onClick={handleDisconnect} variant="destructive">
            Disconnect
          </Button>
        )}
      </div>
    </div>
  );
}
