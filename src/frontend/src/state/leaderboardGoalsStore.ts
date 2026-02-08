/**
 * Persisted Zustand store for goal period selection (Monthly/Quarterly)
 * and stable per-metric targets per recruiter (and optional per team)
 * stored in local persistence for prototype stability across refreshes.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LeaderboardMetric } from '../utils/leaderboards';

export type GoalPeriod = 'monthly' | 'quarterly';

interface GoalTargets {
  [recruiterId: string]: {
    calls?: number;
    hours?: number;
    placements?: number;
    revenue?: number;
  };
}

interface LeaderboardGoalsState {
  period: GoalPeriod;
  targets: GoalTargets;
  setPeriod: (period: GoalPeriod) => void;
  setTarget: (id: string, metric: LeaderboardMetric, value: number) => void;
  getTarget: (id: string, metric: LeaderboardMetric) => number | undefined;
  initializeDefaultTargets: () => void;
}

// Default targets for prototype
const DEFAULT_MONTHLY_TARGETS = {
  calls: 200,
  hours: 160,
  placements: 3,
  revenue: 45000,
};

const DEFAULT_QUARTERLY_TARGETS = {
  calls: 600,
  hours: 480,
  placements: 9,
  revenue: 135000,
};

export const useLeaderboardGoalsStore = create<LeaderboardGoalsState>()(
  persist(
    (set, get) => ({
      period: 'monthly',
      targets: {},
      
      setPeriod: (period) => set({ period }),
      
      setTarget: (id, metric, value) =>
        set((state) => ({
          targets: {
            ...state.targets,
            [id]: {
              ...state.targets[id],
              [metric]: value,
            },
          },
        })),
      
      getTarget: (id, metric) => {
        const state = get();
        return state.targets[id]?.[metric];
      },
      
      initializeDefaultTargets: () => {
        const state = get();
        const defaults = state.period === 'monthly' ? DEFAULT_MONTHLY_TARGETS : DEFAULT_QUARTERLY_TARGETS;
        
        // Initialize with defaults if not set
        const newTargets = { ...state.targets };
        
        // For prototype, set default targets for all recruiters
        ['rec-001', 'rec-002', 'rec-003', 'rec-004', 'rec-005'].forEach((id) => {
          if (!newTargets[id]) {
            newTargets[id] = { ...defaults };
          }
        });
        
        // For teams
        ['Team Alpha', 'Team Beta'].forEach((team) => {
          if (!newTargets[team]) {
            newTargets[team] = {
              calls: defaults.calls * 2,
              hours: defaults.hours * 2,
              placements: defaults.placements * 2,
              revenue: defaults.revenue * 2,
            };
          }
        });
        
        set({ targets: newTargets });
      },
    }),
    {
      name: 'leaderboard-goals',
    }
  )
);
