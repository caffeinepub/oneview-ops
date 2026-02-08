import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Upload } from 'lucide-react';
import { useOrgContext } from '../../../state/orgContext';
import { toast } from 'sonner';

export default function ConnectTimesheetsStep() {
  const { orgConfig, updateOrgConfig } = useOrgContext();
  const [useSampleData, setUseSampleData] = useState(true);
  const [provider, setProvider] = useState<string>('clockify');
  const [apiKey, setApiKey] = useState('');

  const handleConnect = () => {
    updateOrgConfig({
      integrations: {
        ...orgConfig.integrations,
        timesheets: {
          connected: true,
          provider,
          apiKey: useSampleData ? 'sample' : apiKey,
          useSampleData,
        },
      },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`CSV file "${file.name}" uploaded successfully`);
      updateOrgConfig({
        integrations: {
          ...orgConfig.integrations,
          timesheets: {
            connected: true,
            provider: 'csv',
            useSampleData: false,
          },
        },
      });
    }
  };

  const isConnected = orgConfig.integrations.timesheets.connected;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Connect Timesheet System</h3>
        <p className="text-sm text-muted-foreground">
          Track logged hours, billable vs non-billable time, and recruiter mapping
        </p>
      </div>

      {isConnected ? (
        <Card className="p-6 bg-accent/50 border-accent">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-semibold">Timesheets Connected</p>
              <p className="text-sm text-muted-foreground">
                Using {orgConfig.integrations.timesheets.provider} 
                {orgConfig.integrations.timesheets.useSampleData ? ' (sample data)' : ''}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="sample-timesheet" className="font-semibold">Use Sample Data</Label>
              <p className="text-sm text-muted-foreground">
                Perfect for testing and demos
              </p>
            </div>
            <Switch
              id="sample-timesheet"
              checked={useSampleData}
              onCheckedChange={setUseSampleData}
            />
          </div>

          {!useSampleData && (
            <>
              <div className="space-y-2">
                <Label htmlFor="timesheet-provider">Timesheet Provider</Label>
                <Select value={provider} onValueChange={setProvider}>
                  <SelectTrigger id="timesheet-provider">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clockify">Clockify</SelectItem>
                    <SelectItem value="harvest">Harvest</SelectItem>
                    <SelectItem value="toggl">Toggl</SelectItem>
                    <SelectItem value="csv">CSV Upload</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {provider === 'csv' ? (
                <div className="space-y-2">
                  <Label htmlFor="csv-upload">Upload CSV File</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Input
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Label htmlFor="csv-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">Click to upload CSV</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Required columns: date, userId, hours, billable
                      </p>
                    </Label>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="timesheet-api-key">API Key</Label>
                  <Input
                    id="timesheet-api-key"
                    type="password"
                    placeholder={`Enter your ${provider} API key`}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
              )}
            </>
          )}

          {provider !== 'csv' && (
            <Button onClick={handleConnect} className="w-full">
              Connect {useSampleData ? 'with Sample Data' : provider}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
