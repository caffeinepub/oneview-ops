/**
 * Shared filter application utilities for consistent fact/dimension filtering
 * across leaderboards, dashboards, data health, and AI reports.
 */

import type { DimRecruiter, DimJob, FactCall, FactHours, FactPipeline, FactPlacement } from '../data/analyticsSchema';

export interface FilterCriteria {
  dateRange?: string;
  recruiter?: string;
  client?: string;
  job?: string;
}

/**
 * Parse date range string to start/end dates
 */
export function parseDateRange(dateRange?: string): { start: Date; end: Date } {
  const end = new Date();
  let start = new Date();

  switch (dateRange) {
    case 'Last 7 days':
      start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'Last 30 days':
      start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'Last 90 days':
      start = new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case 'This year':
      start = new Date(end.getFullYear(), 0, 1);
      break;
    case 'Last month':
      start = new Date(end.getFullYear(), end.getMonth() - 1, 1);
      end.setDate(0); // Last day of previous month
      break;
    default:
      start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  return { start, end };
}

/**
 * Filter calls by criteria
 */
export function filterCalls(calls: FactCall[], filters: FilterCriteria, recruiters: DimRecruiter[]): FactCall[] {
  const { start, end } = parseDateRange(filters.dateRange);
  
  return calls.filter((call) => {
    // Date filter
    if (call.call_datetime < start || call.call_datetime > end) return false;
    
    // Recruiter filter
    if (filters.recruiter) {
      const recruiter = recruiters.find((r) => 
        r.recruiter_name.toLowerCase().replace(' ', '-') === filters.recruiter
      );
      if (recruiter && call.recruiter_email !== recruiter.recruiter_email) return false;
    }
    
    return true;
  });
}

/**
 * Filter hours by criteria
 */
export function filterHours(hours: FactHours[], filters: FilterCriteria, recruiters: DimRecruiter[]): FactHours[] {
  const { start, end } = parseDateRange(filters.dateRange);
  
  return hours.filter((hour) => {
    // Date filter
    if (hour.work_date < start || hour.work_date > end) return false;
    
    // Recruiter filter
    if (filters.recruiter) {
      const recruiter = recruiters.find((r) => 
        r.recruiter_name.toLowerCase().replace(' ', '-') === filters.recruiter
      );
      if (recruiter && hour.recruiter_email !== recruiter.recruiter_email) return false;
    }
    
    // Client filter
    if (filters.client && hour.client_name) {
      const clientMatch = hour.client_name.toLowerCase().replace(/\s+/g, '-');
      if (clientMatch !== filters.client) return false;
    }
    
    // Job filter
    if (filters.job && hour.job_id !== filters.job) return false;
    
    return true;
  });
}

/**
 * Filter pipeline by criteria
 */
export function filterPipeline(pipeline: FactPipeline[], filters: FilterCriteria, recruiters: DimRecruiter[]): FactPipeline[] {
  const { start, end } = parseDateRange(filters.dateRange);
  
  return pipeline.filter((p) => {
    // Date filter
    if (p.stage_start_date < start || p.stage_start_date > end) return false;
    
    // Recruiter filter
    if (filters.recruiter) {
      const recruiter = recruiters.find((r) => 
        r.recruiter_name.toLowerCase().replace(' ', '-') === filters.recruiter
      );
      if (recruiter && p.recruiter_id !== recruiter.recruiter_id) return false;
    }
    
    // Job filter
    if (filters.job && p.job_id !== filters.job) return false;
    
    return true;
  });
}

/**
 * Filter placements by criteria
 */
export function filterPlacements(placements: FactPlacement[], filters: FilterCriteria, recruiters: DimRecruiter[], jobs: DimJob[]): FactPlacement[] {
  const { start, end } = parseDateRange(filters.dateRange);
  
  return placements.filter((p) => {
    // Date filter
    if (p.placement_date < start || p.placement_date > end) return false;
    
    // Recruiter filter
    if (filters.recruiter) {
      const recruiter = recruiters.find((r) => 
        r.recruiter_name.toLowerCase().replace(' ', '-') === filters.recruiter
      );
      if (recruiter && p.recruiter_id !== recruiter.recruiter_id) return false;
    }
    
    // Job filter
    if (filters.job && p.job_id !== filters.job) return false;
    
    // Client filter (via job join)
    if (filters.client) {
      const job = jobs.find((j) => j.job_id === p.job_id);
      if (job) {
        const clientMatch = job.client_name.toLowerCase().replace(/\s+/g, '-');
        if (clientMatch !== filters.client) return false;
      }
    }
    
    return true;
  });
}
