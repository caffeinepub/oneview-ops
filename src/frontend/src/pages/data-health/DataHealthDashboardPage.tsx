/**
 * Data Health Dashboard page showing an overall data health score, counts by severity,
 * and separate sections/tables for flagged/invalid/warnings/quarantined issues
 * using shadcn-ui components.
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, XCircle, Flag, Ban, CheckCircle } from 'lucide-react';
import { useGlobalFilters } from '../../hooks/useGlobalFilters';
import { computeDataHealthIssues, computeDataHealthScore, type IssueSeverity } from '../../utils/dataHealth';
import GlobalFilterBar from '../../components/filters/GlobalFilterBar';

export default function DataHealthDashboardPage() {
  const { filters } = useGlobalFilters();

  const issues = computeDataHealthIssues(filters);
  const score = computeDataHealthScore(issues);

  const getIssuesBySeverity = (severity: IssueSeverity) => {
    return issues.filter((i) => i.severity === severity);
  };

  const getSeverityIcon = (severity: IssueSeverity) => {
    switch (severity) {
      case 'flagged':
        return <Flag className="h-4 w-4 text-blue-500" />;
      case 'invalid':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'quarantined':
        return <Ban className="h-4 w-4 text-purple-500" />;
    }
  };

  const getSeverityBadgeVariant = (severity: IssueSeverity) => {
    switch (severity) {
      case 'flagged':
        return 'secondary';
      case 'invalid':
        return 'destructive';
      case 'warning':
        return 'outline';
      case 'quarantined':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Attention';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Data Health Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor data quality and identify issues across your integrated systems
        </p>
      </div>

      <GlobalFilterBar />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardDescription>Overall Score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={`text-4xl font-bold ${getScoreColor(score.overall)}`}>
                {score.overall}
              </div>
              <div className="text-sm text-muted-foreground">/ 100</div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{getScoreLabel(score.overall)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-blue-500" />
              Flagged
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{score.flagged}</div>
            <p className="text-xs text-muted-foreground mt-1">Missing data</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Invalid
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{score.invalid}</div>
            <p className="text-xs text-muted-foreground mt-1">Invalid records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Warnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{score.warnings}</div>
            <p className="text-xs text-muted-foreground mt-1">Potential issues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Ban className="h-4 w-4 text-purple-500" />
              Quarantined
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{score.quarantined}</div>
            <p className="text-xs text-muted-foreground mt-1">Orphaned data</p>
          </CardContent>
        </Card>
      </div>

      {/* Issues by Severity */}
      <Card>
        <CardHeader>
          <CardTitle>Data Quality Issues</CardTitle>
          <CardDescription>
            Review and resolve issues to improve data health
          </CardDescription>
        </CardHeader>
        <CardContent>
          {issues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Issues Found</h3>
              <p className="text-muted-foreground">
                Your data is healthy! All quality checks passed.
              </p>
            </div>
          ) : (
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All ({issues.length})</TabsTrigger>
                <TabsTrigger value="flagged">Flagged ({score.flagged})</TabsTrigger>
                <TabsTrigger value="invalid">Invalid ({score.invalid})</TabsTrigger>
                <TabsTrigger value="warning">Warnings ({score.warnings})</TabsTrigger>
                <TabsTrigger value="quarantined">Quarantined ({score.quarantined})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <IssuesTable issues={issues} getSeverityIcon={getSeverityIcon} getSeverityBadgeVariant={getSeverityBadgeVariant} />
              </TabsContent>

              <TabsContent value="flagged" className="mt-4">
                <IssuesTable issues={getIssuesBySeverity('flagged')} getSeverityIcon={getSeverityIcon} getSeverityBadgeVariant={getSeverityBadgeVariant} />
              </TabsContent>

              <TabsContent value="invalid" className="mt-4">
                <IssuesTable issues={getIssuesBySeverity('invalid')} getSeverityIcon={getSeverityIcon} getSeverityBadgeVariant={getSeverityBadgeVariant} />
              </TabsContent>

              <TabsContent value="warning" className="mt-4">
                <IssuesTable issues={getIssuesBySeverity('warning')} getSeverityIcon={getSeverityIcon} getSeverityBadgeVariant={getSeverityBadgeVariant} />
              </TabsContent>

              <TabsContent value="quarantined" className="mt-4">
                <IssuesTable issues={getIssuesBySeverity('quarantined')} getSeverityIcon={getSeverityIcon} getSeverityBadgeVariant={getSeverityBadgeVariant} />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface IssuesTableProps {
  issues: any[];
  getSeverityIcon: (severity: IssueSeverity) => React.ReactElement;
  getSeverityBadgeVariant: (severity: IssueSeverity) => any;
}

function IssuesTable({ issues, getSeverityIcon, getSeverityBadgeVariant }: IssuesTableProps) {
  if (issues.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No issues in this category
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-24">Severity</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Issue</TableHead>
          <TableHead>Explanation</TableHead>
          <TableHead>Recommended Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {issues.map((issue) => (
          <TableRow key={issue.id}>
            <TableCell>
              <Badge variant={getSeverityBadgeVariant(issue.severity)} className="gap-1">
                {getSeverityIcon(issue.severity)}
                {issue.severity}
              </Badge>
            </TableCell>
            <TableCell className="font-medium">{issue.category}</TableCell>
            <TableCell>{issue.message}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{issue.explanation}</TableCell>
            <TableCell className="text-sm">{issue.recommendedAction}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
