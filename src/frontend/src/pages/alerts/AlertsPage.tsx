import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';
import { generateAlerts } from '../../data/sampleData';
import { useState } from 'react';
import { useGlobalFilters } from '../../hooks/useGlobalFilters';
import AlertCard from '../../components/alerts/AlertCard';

export default function AlertsPage() {
  const { filters } = useGlobalFilters();
  const [alerts, setAlerts] = useState(generateAlerts(filters));

  const handleAcknowledge = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, acknowledged: true } : alert
    ));
  };

  const handleDismiss = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const activeAlerts = alerts.filter(a => !a.acknowledged);
  const acknowledgedAlerts = alerts.filter(a => a.acknowledged);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Alerts & Insights</h1>
        <p className="text-muted-foreground">
          AI-generated insights and anomaly detection based on your data
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acknowledged</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acknowledgedAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Reviewed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Insights</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">
              This period
            </p>
          </CardContent>
        </Card>
      </div>

      {activeAlerts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Active Alerts</h2>
          {activeAlerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={handleAcknowledge}
              onDismiss={handleDismiss}
            />
          ))}
        </div>
      )}

      {acknowledgedAlerts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Acknowledged</h2>
          {acknowledgedAlerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={handleAcknowledge}
              onDismiss={handleDismiss}
            />
          ))}
        </div>
      )}
    </div>
  );
}
