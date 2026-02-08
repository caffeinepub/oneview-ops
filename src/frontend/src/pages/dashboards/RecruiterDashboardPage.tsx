import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import GlobalFilterBar from '../../components/filters/GlobalFilterBar';
import { useGlobalFilters } from '../../hooks/useGlobalFilters';
import { generateRecruiterMetrics, generatePipelineMovement, generateInterviewOfferData } from '../../data/sampleData';
import { Phone, Clock, TrendingUp, Users, Calendar, FileCheck } from 'lucide-react';

export default function RecruiterDashboardPage() {
  const { filters } = useGlobalFilters();

  const metrics = generateRecruiterMetrics(filters);
  const pipelineData = generatePipelineMovement(filters);
  const interviewOfferData = generateInterviewOfferData(filters);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Recruiter Dashboard</h1>
        <p className="text-muted-foreground">
          Track your calls, hours, pipeline activity, and placements
        </p>
      </div>

      <GlobalFilterBar />

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalCalls}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.avgCallDuration} min avg
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Logged</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalHours}h</div>
            <p className="text-xs text-muted-foreground">
              {metrics.billableHours}h billable
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Moves</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pipelineMoves}</div>
            <p className="text-xs text-muted-foreground">
              Candidates advanced
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Placements</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.placements}</div>
            <p className="text-xs text-muted-foreground">
              This period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.interviews}</div>
            <p className="text-xs text-muted-foreground">
              Conducted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offers</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.offers}</div>
            <p className="text-xs text-muted-foreground">
              Extended
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interview & Offer Activity</CardTitle>
          <CardDescription>Recent interview and offer events</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interviewOfferData.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{item.candidate}</TableCell>
                  <TableCell>{item.event}</TableCell>
                  <TableCell>{item.stage}</TableCell>
                  <TableCell>{item.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline Movement</CardTitle>
          <CardDescription>Recent candidate stage transitions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>From Stage</TableHead>
                <TableHead>To Stage</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pipelineData.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{item.candidate}</TableCell>
                  <TableCell>{item.fromStage}</TableCell>
                  <TableCell>{item.toStage}</TableCell>
                  <TableCell>{item.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
