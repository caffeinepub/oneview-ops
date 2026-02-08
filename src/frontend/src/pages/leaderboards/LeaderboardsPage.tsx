/**
 * Leaderboards page UI with metric switcher (Calls/Hours/Placements-Hires/Revenue),
 * view toggle (Individual vs Team), goal period selection, target/current/progress columns,
 * and org-type-aware revenue goal behavior using existing shadcn-ui components.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { useGlobalFilters } from '../../hooks/useGlobalFilters';
import { useOrgContext } from '../../state/orgContext';
import { useLeaderboardGoalsStore } from '../../state/leaderboardGoalsStore';
import {
  computeIndividualLeaderboard,
  computeTeamLeaderboard,
  type LeaderboardMetric,
  type LeaderboardView,
} from '../../utils/leaderboards';
import { formatCurrency, formatNumber, formatHours, formatPercent } from '../../utils/formatting';
import GlobalFilterBar from '../../components/filters/GlobalFilterBar';

export default function LeaderboardsPage() {
  const { filters } = useGlobalFilters();
  const { orgConfig } = useOrgContext();
  const { period, targets, setPeriod, initializeDefaultTargets } = useLeaderboardGoalsStore();
  
  const [metric, setMetric] = useState<LeaderboardMetric>('calls');
  const [view, setView] = useState<LeaderboardView>('individual');

  const isStaffingAgency = orgConfig.orgType === 'staffing';

  // Initialize default targets on mount
  useEffect(() => {
    initializeDefaultTargets();
  }, [period, initializeDefaultTargets]);

  // Compute leaderboard
  const baseEntries = view === 'individual'
    ? computeIndividualLeaderboard(metric, filters)
    : computeTeamLeaderboard(metric, filters);

  // Apply goals - extract the target for current metric
  const entries = baseEntries.map((entry) => {
    const entryTargets = targets[entry.id];
    const target = entryTargets?.[metric];
    
    return {
      ...entry,
      target,
      progress: target ? (entry.value / target) * 100 : undefined,
    };
  });

  // Format value based on metric
  const formatValue = (value: number, metric: LeaderboardMetric): string => {
    switch (metric) {
      case 'calls':
        return formatNumber(value);
      case 'hours':
        return formatHours(value);
      case 'placements':
        return formatNumber(value);
      case 'revenue':
        return formatCurrency(value);
      default:
        return formatNumber(value);
    }
  };

  // Get rank icon
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  // Check if revenue metric should be disabled
  const isRevenueDisabled = metric === 'revenue' && !isStaffingAgency;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Leaderboards</h1>
        <p className="text-muted-foreground">
          Gamified rankings across effort and outcome metrics
        </p>
      </div>

      <GlobalFilterBar />

      <div className="flex flex-wrap gap-4 items-center">
        {/* Metric Selector */}
        <div className="flex-1 min-w-[200px]">
          <Select value={metric} onValueChange={(value) => setMetric(value as LeaderboardMetric)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="calls">Calls</SelectItem>
              <SelectItem value="hours">Hours</SelectItem>
              <SelectItem value="placements">Placements / Hires</SelectItem>
              <SelectItem value="revenue" disabled={!isStaffingAgency}>
                Revenue {!isStaffingAgency && '(Agency Only)'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle */}
        <Tabs value={view} onValueChange={(value) => setView(value as LeaderboardView)}>
          <TabsList>
            <TabsTrigger value="individual">Individual</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Goal Period */}
        <div className="flex-1 min-w-[200px]">
          <Select value={period} onValueChange={(value) => setPeriod(value as 'monthly' | 'quarterly')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly Goals</SelectItem>
              <SelectItem value="quarterly">Quarterly Goals</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isRevenueDisabled && (
        <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950">
          <CardContent className="pt-6">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Revenue metrics are only available for Staffing Agency organizations. Your organization is configured as Internal TA.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {view === 'individual' ? 'Individual' : 'Team'} Rankings - {metric.charAt(0).toUpperCase() + metric.slice(1)}
          </CardTitle>
          <CardDescription>
            {period === 'monthly' ? 'Monthly' : 'Quarterly'} performance and goal progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Name</TableHead>
                {view === 'individual' && <TableHead>Team</TableHead>}
                <TableHead className="text-right">Current</TableHead>
                <TableHead className="text-right">Target</TableHead>
                <TableHead className="text-right">Progress</TableHead>
                <TableHead className="w-[200px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getRankIcon(entry.rank)}
                      <span className="font-semibold">{entry.rank}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{entry.name}</TableCell>
                  {view === 'individual' && (
                    <TableCell>
                      <Badge variant="outline">{entry.team || '—'}</Badge>
                    </TableCell>
                  )}
                  <TableCell className="text-right font-semibold">
                    {formatValue(entry.value, metric)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {entry.target ? formatValue(entry.target, metric) : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.progress !== undefined ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant={entry.progress >= 100 ? 'default' : entry.progress >= 75 ? 'secondary' : 'outline'}
                            >
                              {formatPercent(entry.progress, 0)}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{entry.progress >= 100 ? 'Goal achieved!' : `${(100 - entry.progress).toFixed(0)}% to goal`}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell>
                    {entry.progress !== undefined && (
                      <Progress value={Math.min(entry.progress, 100)} className="h-2" />
                    )}
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
