/**
 * Deterministic leaderboard computation helpers (ranking, ties, team aggregation, metric selection)
 * that consume the star-schema sample data and current global filters.
 */

import type { DimRecruiter } from '../data/analyticsSchema';
import {
  dimRecruiters,
  dimJobs,
  factCalls,
  factHours,
  factPipeline,
  factPlacements,
  joinRecruiter,
  getTeamMembers,
  getUniqueTeams,
} from '../data/analyticsSchema';
import { filterCalls, filterHours, filterPipeline, filterPlacements, type FilterCriteria } from './filters';

export type LeaderboardMetric = 'calls' | 'hours' | 'placements' | 'revenue';
export type LeaderboardView = 'individual' | 'team';

export interface LeaderboardEntry {
  id: string;
  name: string;
  rank: number;
  value: number;
  target?: number;
  progress?: number;
  team?: string;
}

/**
 * Compute individual leaderboard
 */
export function computeIndividualLeaderboard(
  metric: LeaderboardMetric,
  filters: FilterCriteria
): LeaderboardEntry[] {
  const entries: LeaderboardEntry[] = [];

  dimRecruiters.forEach((recruiter) => {
    let value = 0;

    switch (metric) {
      case 'calls': {
        const calls = filterCalls(factCalls, filters, dimRecruiters).filter(
          (c) => c.recruiter_email === recruiter.recruiter_email
        );
        value = calls.length;
        break;
      }
      case 'hours': {
        const hours = filterHours(factHours, filters, dimRecruiters).filter(
          (h) => h.recruiter_email === recruiter.recruiter_email
        );
        value = hours.reduce((sum, h) => sum + h.hours_logged, 0);
        break;
      }
      case 'placements': {
        const placements = filterPlacements(factPlacements, filters, dimRecruiters, dimJobs).filter(
          (p) => p.recruiter_id === recruiter.recruiter_id
        );
        value = placements.length;
        break;
      }
      case 'revenue': {
        const placements = filterPlacements(factPlacements, filters, dimRecruiters, dimJobs).filter(
          (p) => p.recruiter_id === recruiter.recruiter_id
        );
        value = placements.reduce((sum, p) => sum + (p.revenue_amount || 0), 0);
        break;
      }
    }

    entries.push({
      id: recruiter.recruiter_id,
      name: recruiter.recruiter_name,
      rank: 0, // Will be set after sorting
      value,
      team: recruiter.team,
    });
  });

  // Sort by value descending and assign ranks
  entries.sort((a, b) => b.value - a.value);
  entries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return entries;
}

/**
 * Compute team leaderboard
 */
export function computeTeamLeaderboard(
  metric: LeaderboardMetric,
  filters: FilterCriteria
): LeaderboardEntry[] {
  const teams = getUniqueTeams();
  const entries: LeaderboardEntry[] = [];

  teams.forEach((team) => {
    const teamMembers = getTeamMembers(team);
    let value = 0;

    teamMembers.forEach((recruiter) => {
      switch (metric) {
        case 'calls': {
          const calls = filterCalls(factCalls, filters, dimRecruiters).filter(
            (c) => c.recruiter_email === recruiter.recruiter_email
          );
          value += calls.length;
          break;
        }
        case 'hours': {
          const hours = filterHours(factHours, filters, dimRecruiters).filter(
            (h) => h.recruiter_email === recruiter.recruiter_email
          );
          value += hours.reduce((sum, h) => sum + h.hours_logged, 0);
          break;
        }
        case 'placements': {
          const placements = filterPlacements(factPlacements, filters, dimRecruiters, dimJobs).filter(
            (p) => p.recruiter_id === recruiter.recruiter_id
          );
          value += placements.length;
          break;
        }
        case 'revenue': {
          const placements = filterPlacements(factPlacements, filters, dimRecruiters, dimJobs).filter(
            (p) => p.recruiter_id === recruiter.recruiter_id
          );
          value += placements.reduce((sum, p) => sum + (p.revenue_amount || 0), 0);
          break;
        }
      }
    });

    entries.push({
      id: team,
      name: team,
      rank: 0,
      value,
    });
  });

  // Sort by value descending and assign ranks
  entries.sort((a, b) => b.value - a.value);
  entries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return entries;
}

/**
 * Get leaderboard with goals
 */
export function getLeaderboardWithGoals(
  entries: LeaderboardEntry[],
  targets: Record<string, Record<string, number>>
): LeaderboardEntry[] {
  return entries.map((entry) => {
    const entryTargets = targets[entry.id];
    // For now, we'll use a simple approach - the metric is determined by context
    // This is a simplified version for the prototype
    const target = entryTargets ? Object.values(entryTargets)[0] : undefined;
    
    return {
      ...entry,
      target,
      progress: target ? (entry.value / target) * 100 : undefined,
    };
  });
}
