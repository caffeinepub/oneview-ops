import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import GlobalFilterBar from '../../components/filters/GlobalFilterBar';
import { useGlobalFilters } from '../../hooks/useGlobalFilters';
import { generateOpsMetrics, generateDataGaps } from '../../data/sampleData';
import { Activity, AlertTriangle, Database, Briefcase } from 'lucide-react';

export default function OpsHrDashboardPage() {
  const { filters } = useGlobalFilters();

  const metrics = generateOpsMetrics(filters);
  const dataGaps = generateDataGaps(filters);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Ops/HR Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor team utilization, burnout risk, and data quality
        </p>
      </div>

      <GlobalFilterBar />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Utilization</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.utilization}%</div>
            <Progress value={metrics.utilization} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Target: 80-90%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Burnout Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.burnoutRisk}</div>
            <Badge variant={metrics.burnoutRisk === 'Low' ? 'secondary' : 'destructive'} className="mt-2">
              {metrics.burnoutRisk} Risk
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Based on hours & call volume
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Completeness</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.dataCompleteness}%</div>
            <Progress value={metrics.dataCompleteness} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {dataGaps.length} gaps identified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contractors</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeContractors}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Currently placed
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Gaps Requiring Attention</CardTitle>
          <CardDescription>Missing or incomplete data fields across systems</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataGaps.map((gap, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{gap.system}</p>
                  <p className="text-sm text-muted-foreground">{gap.field}</p>
                </div>
                <Badge variant="outline">{gap.count} records</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
