import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { useOrgContext } from '../../../state/orgContext';

export default function ConnectAircallStep() {
  const { orgConfig, updateOrgConfig } = useOrgContext();
  const [useSampleData, setUseSampleData] = useState(true);
  const [apiKey, setApiKey] = useState('');

  const handleConnect = () => {
    updateOrgConfig({
      integrations: {
        ...orgConfig.integrations,
        aircall: {
          connected: true,
          apiKey: useSampleData ? 'sample' : apiKey,
          useSampleData,
        },
      },
    });
  };

  const isConnected = orgConfig.integrations.aircall.connected;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Connect Aircall</h3>
        <p className="text-sm text-muted-foreground">
          Aircall provides call data including duration, direction, and user mapping
        </p>
      </div>

      {isConnected ? (
        <Card className="p-6 bg-accent/50 border-accent">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-semibold">Aircall Connected</p>
              <p className="text-sm text-muted-foreground">
                Using {orgConfig.integrations.aircall.useSampleData ? 'sample data' : 'API connection'}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="sample-aircall" className="font-semibold">Use Sample Data</Label>
              <p className="text-sm text-muted-foreground">
                Perfect for testing and demos
              </p>
            </div>
            <Switch
              id="sample-aircall"
              checked={useSampleData}
              onCheckedChange={setUseSampleData}
            />
          </div>

          {!useSampleData && (
            <div className="space-y-2">
              <Label htmlFor="aircall-api-key">Aircall API Key</Label>
              <Input
                id="aircall-api-key"
                type="password"
                placeholder="Enter your Aircall API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
          )}

          <Button onClick={handleConnect} className="w-full">
            Connect Aircall
          </Button>
        </div>
      )}
    </div>
  );
}
