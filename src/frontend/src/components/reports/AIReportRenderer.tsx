/**
 * Presentational component to render the structured AI report result:
 * KPI cards, a simple table and/or existing chart component integration,
 * and a narrative insight paragraph in English using shadcn-ui building blocks.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { AIReportResult } from '../../utils/aiReports';

interface AIReportRendererProps {
  report: AIReportResult;
}

export default function AIReportRenderer({ report }: AIReportRendererProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{report.title}</h2>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {report.kpis.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardDescription>{kpi.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold">{kpi.value}</div>
                {kpi.change && (
                  <Badge variant={kpi.change.startsWith('+') ? 'default' : 'destructive'} className="gap-1">
                    {kpi.change.startsWith('+') ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {kpi.change}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      {report.table && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {report.table.headers.map((header, index) => (
                    <TableHead key={index}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.table.rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {report.table!.headers.map((header, cellIndex) => (
                      <TableCell key={cellIndex}>{row[header]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Narrative */}
      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{report.narrative}</p>
        </CardContent>
      </Card>
    </div>
  );
}
