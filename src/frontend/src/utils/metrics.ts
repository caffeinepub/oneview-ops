/**
 * Centralized metric computation module (Power BI/DAX-style) built on the star-schema
 * facts/dimensions and shared filter utilities, including: Total Calls, Total Hours Logged,
 * Calls per Placement, Hours per Hire, Revenue per Recruiter, Revenue per Hour, Time-to-Fill,
 * Utilization %. Include safe division helpers and metadata for UI labeling/agency-only flags.
 */

import {
  dimRecruiters,
  dimJobs,
  factCalls,
  factHours,
  factPipeline,
  factPlacements,
} from '../data/analyticsSchema';
import {
  filterCalls,
  filterHours,
  filterPipeline,
  filterPlacements,
  type FilterCriteria,
} from './filters';

export interface MetricMetadata {
  label: string;
  agencyOnly: boolean;
  description: string;
}

export const METRIC_METADATA: Record<string, MetricMetadata> = {
  totalCalls: {
    label: 'Total Calls',
    agencyOnly: false,
    description: 'Total number of calls made and received',
  },
  totalHours: {
    label: 'Total Hours Logged',
    agencyOnly: false,
    description: 'Total hours logged across all recruiters',
  },
  callsPerPlacement: {
    label: 'Calls per Placement',
    agencyOnly: false,
    description: 'Average number of calls required to make a placement',
  },
  hoursPerHire: {
    label: 'Hours per Hire',
    agencyOnly: false,
    description: 'Average hours invested per successful hire',
  },
  revenuePerRecruiter: {
    label: 'Revenue per Recruiter',
    agencyOnly: true,
    description: 'Average revenue generated per recruiter',
  },
  revenuePerHour: {
    label: 'Revenue per Hour',
    agencyOnly: true,
    description: 'Revenue efficiency: dollars earned per hour worked',
  },
  timeToFill: {
    label: 'Time-to-Fill',
    agencyOnly: false,
    description: 'Average days from job opening to placement',
  },
  utilization: {
    label: 'Utilization %',
    agencyOnly: false,
    description: 'Percentage of available hours logged as billable',
  },
};

/**
 * Compute Total Calls
 */
export function computeTotalCalls(filters: FilterCriteria): number {
  const calls = filterCalls(factCalls, filters, dimRecruiters);
  return calls.length;
}

/**
 * Compute Total Hours Logged
 */
export function computeTotalHours(filters: FilterCriteria): number {
  const hours = filterHours(factHours, filters, dimRecruiters);
  return hours.reduce((sum, h) => sum + h.hours_logged, 0);
}

/**
 * Compute Calls per Placement
 */
export function computeCallsPerPlacement(filters: FilterCriteria): number | null {
  const calls = filterCalls(factCalls, filters, dimRecruiters);
  const placements = filterPlacements(factPlacements, filters, dimRecruiters, dimJobs);
  
  if (placements.length === 0) return null;
  return calls.length / placements.length;
}

/**
 * Compute Hours per Hire
 */
export function computeHoursPerHire(filters: FilterCriteria): number | null {
  const hours = filterHours(factHours, filters, dimRecruiters);
  const placements = filterPlacements(factPlacements, filters, dimRecruiters, dimJobs);
  
  const totalHours = hours.reduce((sum, h) => sum + h.hours_logged, 0);
  
  if (placements.length === 0) return null;
  return totalHours / placements.length;
}

/**
 * Compute Revenue per Recruiter
 */
export function computeRevenuePerRecruiter(filters: FilterCriteria): number | null {
  const placements = filterPlacements(factPlacements, filters, dimRecruiters, dimJobs);
  const totalRevenue = placements.reduce((sum, p) => sum + (p.revenue_amount || 0), 0);
  
  // Count unique recruiters in filtered data
  const uniqueRecruiters = new Set(placements.map((p) => p.recruiter_id));
  
  if (uniqueRecruiters.size === 0) return null;
  return totalRevenue / uniqueRecruiters.size;
}

/**
 * Compute Revenue per Hour
 */
export function computeRevenuePerHour(filters: FilterCriteria): number | null {
  const hours = filterHours(factHours, filters, dimRecruiters);
  const placements = filterPlacements(factPlacements, filters, dimRecruiters, dimJobs);
  
  const totalHours = hours.reduce((sum, h) => sum + h.hours_logged, 0);
  const totalRevenue = placements.reduce((sum, p) => sum + (p.revenue_amount || 0), 0);
  
  if (totalHours === 0) return null;
  return totalRevenue / totalHours;
}

/**
 * Compute Time-to-Fill (average days)
 */
export function computeTimeToFill(filters: FilterCriteria): number | null {
  const placements = filterPlacements(factPlacements, filters, dimRecruiters, dimJobs);
  
  if (placements.length === 0) return null;
  
  const totalDays = placements.reduce((sum, p) => sum + p.time_to_fill_days, 0);
  return totalDays / placements.length;
}

/**
 * Compute Utilization %
 */
export function computeUtilization(filters: FilterCriteria): number | null {
  const hours = filterHours(factHours, filters, dimRecruiters);
  
  // Assume 8 hours per day, 5 days per week as available hours
  // Count unique work dates
  const uniqueDates = new Set(hours.map((h) => h.work_date.toISOString().split('T')[0]));
  const workDays = uniqueDates.size;
  
  if (workDays === 0) return null;
  
  const totalHours = hours.reduce((sum, h) => sum + h.hours_logged, 0);
  const billableHours = hours.filter((h) => h.is_billable).reduce((sum, h) => sum + h.hours_logged, 0);
  
  if (totalHours === 0) return null;
  return (billableHours / totalHours) * 100;
}

/**
 * Get all metrics for a given filter
 */
export function computeAllMetrics(filters: FilterCriteria) {
  return {
    totalCalls: computeTotalCalls(filters),
    totalHours: computeTotalHours(filters),
    callsPerPlacement: computeCallsPerPlacement(filters),
    hoursPerHire: computeHoursPerHire(filters),
    revenuePerRecruiter: computeRevenuePerRecruiter(filters),
    revenuePerHour: computeRevenuePerHour(filters),
    timeToFill: computeTimeToFill(filters),
    utilization: computeUtilization(filters),
  };
}
