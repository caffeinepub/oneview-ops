/**
 * Deterministic data health rules and scoring computed from the star-schema sample data
 * and global filters: missing recruiter email (flag), calls with 0 duration (invalid),
 * >16 hours/day (warning), placements without job join (quarantine).
 * Include English explanation + recommended next action strings per rule.
 */

import {
  dimRecruiters,
  dimJobs,
  factCalls,
  factHours,
  factPlacements,
  joinRecruiter,
  joinJob,
} from '../data/analyticsSchema';
import { filterCalls, filterHours, filterPlacements, type FilterCriteria } from './filters';

export type IssueSeverity = 'flagged' | 'invalid' | 'warning' | 'quarantined';

export interface DataHealthIssue {
  id: string;
  severity: IssueSeverity;
  category: string;
  message: string;
  explanation: string;
  recommendedAction: string;
  affectedRecord: string;
}

export interface DataHealthScore {
  overall: number;
  flagged: number;
  invalid: number;
  warnings: number;
  quarantined: number;
}

/**
 * Compute data health issues from sample data
 */
export function computeDataHealthIssues(filters: FilterCriteria): DataHealthIssue[] {
  const issues: DataHealthIssue[] = [];
  let issueIdCounter = 1;

  // Filter data
  const filteredCalls = filterCalls(factCalls, filters, dimRecruiters);
  const filteredHours = filterHours(factHours, filters, dimRecruiters);
  const filteredPlacements = filterPlacements(factPlacements, filters, dimRecruiters, dimJobs);

  // Rule 1: Missing recruiter email (flagged)
  filteredCalls.forEach((call) => {
    if (!call.recruiter_email || call.recruiter_email.trim() === '') {
      issues.push({
        id: `issue-${issueIdCounter++}`,
        severity: 'flagged',
        category: 'Missing Data',
        message: `Call ${call.call_id} has no recruiter email`,
        explanation: 'Recruiter email is required to join call data with user records across systems.',
        recommendedAction: 'Update the call record with the correct recruiter email from Aircall.',
        affectedRecord: call.call_id,
      });
    }
  });

  filteredHours.forEach((hour) => {
    if (!hour.recruiter_email || hour.recruiter_email.trim() === '') {
      issues.push({
        id: `issue-${issueIdCounter++}`,
        severity: 'flagged',
        category: 'Missing Data',
        message: `Timesheet ${hour.timesheet_id} has no recruiter email`,
        explanation: 'Recruiter email is required to join timesheet data with user records.',
        recommendedAction: 'Update the timesheet record with the correct user email.',
        affectedRecord: hour.timesheet_id,
      });
    }
  });

  // Rule 2: Calls with 0 duration (invalid)
  filteredCalls.forEach((call) => {
    if (call.call_duration_sec === 0 && !call.is_missed) {
      issues.push({
        id: `issue-${issueIdCounter++}`,
        severity: 'invalid',
        category: 'Invalid Data',
        message: `Call ${call.call_id} has 0 duration but is not marked as missed`,
        explanation: 'Calls with zero duration should be marked as missed or have a valid duration.',
        recommendedAction: 'Review the call record in Aircall and update the duration or missed status.',
        affectedRecord: call.call_id,
      });
    }
  });

  // Rule 3: >16 hours/day (warning)
  const hoursByDate = new Map<string, { total: number; records: string[] }>();
  filteredHours.forEach((hour) => {
    const dateKey = `${hour.recruiter_email}-${hour.work_date.toISOString().split('T')[0]}`;
    if (!hoursByDate.has(dateKey)) {
      hoursByDate.set(dateKey, { total: 0, records: [] });
    }
    const entry = hoursByDate.get(dateKey)!;
    entry.total += hour.hours_logged;
    entry.records.push(hour.timesheet_id);
  });

  hoursByDate.forEach((entry, dateKey) => {
    if (entry.total > 16) {
      const [email, date] = dateKey.split('-');
      const recruiter = joinRecruiter(email);
      issues.push({
        id: `issue-${issueIdCounter++}`,
        severity: 'warning',
        category: 'Burnout Risk',
        message: `${recruiter?.recruiter_name || email} logged ${entry.total.toFixed(1)} hours on ${date}`,
        explanation: 'Logging more than 16 hours in a single day may indicate data entry errors or burnout risk.',
        recommendedAction: 'Review timesheet entries for accuracy and check in with the recruiter about workload.',
        affectedRecord: entry.records.join(', '),
      });
    }
  });

  // Rule 4: Placements without job join (quarantined)
  filteredPlacements.forEach((placement) => {
    const job = joinJob(placement.job_id);
    if (!job) {
      issues.push({
        id: `issue-${issueIdCounter++}`,
        severity: 'quarantined',
        category: 'Orphaned Data',
        message: `Placement ${placement.placement_id} references non-existent job ${placement.job_id}`,
        explanation: 'This placement cannot be properly attributed to a client or analyzed without a valid job record.',
        recommendedAction: 'Verify the job ID in Loxo and update the placement record, or restore the missing job.',
        affectedRecord: placement.placement_id,
      });
    }
  });

  return issues;
}

/**
 * Compute data health score
 */
export function computeDataHealthScore(issues: DataHealthIssue[]): DataHealthScore {
  const flagged = issues.filter((i) => i.severity === 'flagged').length;
  const invalid = issues.filter((i) => i.severity === 'invalid').length;
  const warnings = issues.filter((i) => i.severity === 'warning').length;
  const quarantined = issues.filter((i) => i.severity === 'quarantined').length;

  const totalIssues = flagged + invalid + warnings + quarantined;
  const totalRecords = factCalls.length + factHours.length + factPlacements.length;
  
  // Score: 100 - (issues / records * 100), minimum 0
  const overall = Math.max(0, Math.round(100 - (totalIssues / totalRecords) * 100));

  return {
    overall,
    flagged,
    invalid,
    warnings,
    quarantined,
  };
}
