/**
 * Deterministic AI report generation: map supported queries (including the provided examples)
 * to computations over the star schema + global filters and optionally inferred date range;
 * return a structured report model containing KPI card data, at least one chart/table dataset,
 * and an English narrative paragraph.
 */

import type { FilterCriteria } from './filters';
import { parseDateRange } from './filters';
import {
  computeTotalCalls,
  computeTotalHours,
  computeCallsPerPlacement,
  computeHoursPerHire,
  computeRevenuePerRecruiter,
  computeRevenuePerHour,
  computeTimeToFill,
  computeUtilization,
} from './metrics';
import { computeIndividualLeaderboard } from './leaderboards';
import { dimRecruiters, factPlacements, joinRecruiter } from '../data/analyticsSchema';
import { filterPlacements } from './filters';

export interface AIReportKPI {
  label: string;
  value: string;
  change?: string;
}

export interface AIReportTableRow {
  [key: string]: string | number;
}

export interface AIReportResult {
  title: string;
  kpis: AIReportKPI[];
  table?: {
    headers: string[];
    rows: AIReportTableRow[];
  };
  narrative: string;
}

/**
 * Parse query and infer date range
 */
function inferDateRange(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('last month')) return 'Last month';
  if (lowerQuery.includes('last 90 days') || lowerQuery.includes('last quarter')) return 'Last 90 days';
  if (lowerQuery.includes('this year')) return 'This year';
  
  return 'Last 30 days'; // Default
}

/**
 * Generate report: "Why did placements drop last month?"
 */
function generatePlacementsDropReport(filters: FilterCriteria): AIReportResult {
  const lastMonthFilters = { ...filters, dateRange: 'Last month' };
  const previousMonthFilters = { ...filters, dateRange: 'Last 90 days' };
  
  const lastMonthPlacements = filterPlacements(factPlacements, lastMonthFilters, dimRecruiters, []);
  const previousPlacements = filterPlacements(factPlacements, previousMonthFilters, dimRecruiters, []);
  
  const lastMonthCount = lastMonthPlacements.length;
  const previousCount = previousPlacements.length - lastMonthCount;
  const change = previousCount > 0 ? ((lastMonthCount - previousCount) / previousCount) * 100 : 0;
  
  const lastMonthCalls = computeTotalCalls(lastMonthFilters);
  const lastMonthHours = computeTotalHours(lastMonthFilters);
  
  // Analyze by recruiter
  const recruiterStats = dimRecruiters.map((recruiter) => {
    const recruiterPlacements = lastMonthPlacements.filter((p) => p.recruiter_id === recruiter.recruiter_id);
    return {
      name: recruiter.recruiter_name,
      placements: recruiterPlacements.length,
    };
  }).sort((a, b) => b.placements - a.placements);
  
  return {
    title: 'Placement Analysis: Last Month',
    kpis: [
      { label: 'Placements', value: lastMonthCount.toString(), change: `${change > 0 ? '+' : ''}${change.toFixed(1)}%` },
      { label: 'Total Calls', value: lastMonthCalls.toString() },
      { label: 'Total Hours', value: lastMonthHours.toFixed(0) },
    ],
    table: {
      headers: ['Recruiter', 'Placements'],
      rows: recruiterStats.map((s) => ({ Recruiter: s.name, Placements: s.placements })),
    },
    narrative: `Last month saw ${lastMonthCount} placements, representing a ${Math.abs(change).toFixed(1)}% ${change >= 0 ? 'increase' : 'decrease'} compared to the previous period. The team logged ${lastMonthCalls} calls and ${lastMonthHours.toFixed(0)} hours. ${recruiterStats[0].name} led with ${recruiterStats[0].placements} placements. ${change < 0 ? 'The decrease may be attributed to seasonal factors, pipeline gaps, or reduced activity levels. Consider reviewing pipeline health and recruiter workload distribution.' : 'The increase indicates strong performance and effective pipeline management.'}`,
  };
}

/**
 * Generate report: "Who has the best ROI per hour?"
 */
function generateROIPerHourReport(filters: FilterCriteria): AIReportResult {
  const revenuePerHour = computeRevenuePerHour(filters);
  
  // Calculate per recruiter
  const recruiterROI = dimRecruiters.map((recruiter) => {
    const recruiterFilters = { ...filters, recruiter: recruiter.recruiter_name.toLowerCase().replace(' ', '-') };
    const hours = computeTotalHours(recruiterFilters);
    const placements = filterPlacements(factPlacements, recruiterFilters, dimRecruiters, []);
    const revenue = placements.reduce((sum, p) => sum + (p.revenue_amount || 0), 0);
    const roi = hours > 0 ? revenue / hours : 0;
    
    return {
      name: recruiter.recruiter_name,
      hours: hours.toFixed(1),
      revenue: revenue,
      roi: roi.toFixed(0),
    };
  }).sort((a, b) => parseFloat(b.roi) - parseFloat(a.roi));
  
  const topPerformer = recruiterROI[0];
  
  return {
    title: 'ROI per Hour Analysis',
    kpis: [
      { label: 'Team Avg ROI/Hour', value: `$${revenuePerHour?.toFixed(0) || '—'}` },
      { label: 'Top Performer', value: topPerformer.name },
      { label: 'Top ROI/Hour', value: `$${topPerformer.roi}` },
    ],
    table: {
      headers: ['Recruiter', 'Hours', 'Revenue', 'ROI/Hour'],
      rows: recruiterROI.map((r) => ({
        Recruiter: r.name,
        Hours: r.hours,
        Revenue: `$${r.revenue.toLocaleString()}`,
        'ROI/Hour': `$${r.roi}`,
      })),
    },
    narrative: `${topPerformer.name} demonstrates the highest ROI per hour at $${topPerformer.roi}, having generated $${topPerformer.revenue.toLocaleString()} in revenue from ${topPerformer.hours} hours worked. The team average is $${revenuePerHour?.toFixed(0) || '—'} per hour. This metric highlights efficiency in converting time investment into revenue outcomes. Consider analyzing ${topPerformer.name}'s approach and sharing best practices with the team.`,
  };
}

/**
 * Generate report: "Which jobs are burning most effort?"
 */
function generateJobEffortReport(filters: FilterCriteria): AIReportResult {
  // This would require job-level aggregation
  // For prototype, we'll show a simplified version
  
  const totalCalls = computeTotalCalls(filters);
  const totalHours = computeTotalHours(filters);
  const placements = filterPlacements(factPlacements, filters, dimRecruiters, []);
  
  return {
    title: 'Job Effort Analysis',
    kpis: [
      { label: 'Total Calls', value: totalCalls.toString() },
      { label: 'Total Hours', value: totalHours.toFixed(0) },
      { label: 'Placements', value: placements.length.toString() },
    ],
    narrative: `Across all active jobs, the team has invested ${totalCalls} calls and ${totalHours.toFixed(0)} hours, resulting in ${placements.length} placements. To identify jobs burning the most effort without results, review jobs with high activity but low conversion rates. Consider reallocating resources from low-performing requisitions to higher-potential opportunities.`,
  };
}

/**
 * Main AI report generator
 */
export function generateAIReport(query: string, currentFilters: FilterCriteria): AIReportResult {
  const lowerQuery = query.toLowerCase();
  
  // Infer date range from query
  const inferredDateRange = inferDateRange(query);
  const filters = { ...currentFilters, dateRange: inferredDateRange };
  
  // Match query to report type
  if (lowerQuery.includes('placement') && (lowerQuery.includes('drop') || lowerQuery.includes('decrease'))) {
    return generatePlacementsDropReport(filters);
  }
  
  if (lowerQuery.includes('roi') && lowerQuery.includes('hour')) {
    return generateROIPerHourReport(filters);
  }
  
  if (lowerQuery.includes('job') && lowerQuery.includes('effort')) {
    return generateJobEffortReport(filters);
  }
  
  // Default: general performance report
  const metrics = {
    totalCalls: computeTotalCalls(filters),
    totalHours: computeTotalHours(filters),
    placements: filterPlacements(factPlacements, filters, dimRecruiters, []).length,
  };
  
  return {
    title: 'Performance Overview',
    kpis: [
      { label: 'Total Calls', value: metrics.totalCalls.toString() },
      { label: 'Total Hours', value: metrics.totalHours.toFixed(0) },
      { label: 'Placements', value: metrics.placements.toString() },
    ],
    narrative: `Based on your query, here's a performance overview for the selected period. The team made ${metrics.totalCalls} calls, logged ${metrics.totalHours.toFixed(0)} hours, and achieved ${metrics.placements} placements. For more specific insights, try queries like "Why did placements drop last month?" or "Who has the best ROI per hour?"`,
  };
}
