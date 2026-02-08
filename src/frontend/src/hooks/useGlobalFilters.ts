import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GlobalFilters {
  dateRange?: string;
  recruiter?: string;
  client?: string;
  job?: string;
}

interface GlobalFiltersState {
  filters: GlobalFilters;
  updateFilters: (filters: Partial<GlobalFilters>) => void;
  clearFilters: () => void;
}

export const useGlobalFilters = create<GlobalFiltersState>()(
  persist(
    (set) => ({
      filters: {
        dateRange: 'Last 30 days',
      },
      updateFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      clearFilters: () =>
        set({
          filters: { dateRange: 'Last 30 days' },
        }),
    }),
    {
      name: 'global-filters',
    }
  )
);
