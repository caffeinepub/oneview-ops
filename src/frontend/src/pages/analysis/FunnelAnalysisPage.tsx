import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import GlobalFilterBar from '../../components/filters/GlobalFilterBar';
import { useGlobalFilters } from '../../hooks/useGlobalFilters';
import { generateFunnelAnalysis, generateTopPerformers } from '../../data/sampleData';
import { ArrowRight, TrendingUp } from 'lucide-react';

export default function FunnelAnalysisPage() {
  const { filters } = useGlobalFilters();

  const funnelData = generateFunnelAnalysis(filters);
  const topPerformers = generateTopPerformers(filters);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Call → Hours → Outcome Funnel</h1>
        <p className="text-muted-foreground">
          Analyze the correlation between activity, effort, and results
        </p>
      </div>

      <GlobalFilterBar />

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Calls</CardTitle>
            <CardDescription>Total calling activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{funnelData.calls}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {funnelData.avgCallsPerDay} per day avg
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hours</CardTitle>
            <CardDescription>Time invested</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{funnelData.hours}h</div>
            <p className="text-sm text-muted-foreground mt-2">
              {funnelData.hoursPerCall}h per call
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Outcomes</CardTitle>
            <CardDescription>Placements achieved</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{funnelData.outcomes}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {funnelData.conversionRate}% conversion
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conversion Metrics</CardTitle>
          <CardDescription>Efficiency ratios across the funnel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Calls per Outcome</p>
                <p className="text-2xl font-bold">{funnelData.callsPerOutcome}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Hours per Outcome</p>
                <p className="text-2xl font-bold">{funnelData.hoursPerOutcome}h</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Outcome Rate</p>
                <p className="text-2xl font-bold">{funnelData.conversionRate}%</p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>Recruiters by outcome per hour efficiency</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recruiter</TableHead>
                <TableHead className="text-right">Calls</TableHead>
                <TableHead className="text-right">Hours</TableHead>
                <TableHead className="text-right">Outcomes</TableHead>
                <TableHead className="text-right">Efficiency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPerformers.map((performer, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{performer.name}</TableCell>
                  <TableCell className="text-right">{performer.calls}</TableCell>
                  <TableCell className="text-right">{performer.hours}h</TableCell>
                  <TableCell className="text-right">{performer.outcomes}</TableCell>
                  <TableCell className="text-right font-semibold text-green-600">
                    {performer.efficiency}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
