import { createContext, useContext, ReactNode } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OrganizationType } from '../backend';

interface OrgConfig {
  orgType?: OrganizationType;
  integrations: {
    loxo: {
      connected: boolean;
      apiKey?: string;
      useSampleData?: boolean;
    };
    aircall: {
      connected: boolean;
      apiKey?: string;
      useSampleData?: boolean;
    };
    timesheets: {
      connected: boolean;
      provider?: string;
      apiKey?: string;
      useSampleData?: boolean;
    };
  };
}

interface OrgContextState {
  orgConfig: OrgConfig;
  updateOrgConfig: (config: Partial<OrgConfig>) => void;
}

const useOrgStore = create<OrgContextState>()(
  persist(
    (set) => ({
      orgConfig: {
        integrations: {
          loxo: { connected: false },
          aircall: { connected: false },
          timesheets: { connected: false },
        },
      },
      updateOrgConfig: (config) =>
        set((state) => ({
          orgConfig: { ...state.orgConfig, ...config },
        })),
    }),
    {
      name: 'org-config',
    }
  )
);

const OrgContext = createContext<OrgContextState | null>(null);

export function OrgProvider({ children }: { children: ReactNode }) {
  const store = useOrgStore();
  return <OrgContext.Provider value={store}>{children}</OrgContext.Provider>;
}

export function useOrgContext() {
  const context = useContext(OrgContext);
  const store = useOrgStore();
  
  if (!context) {
    return store;
  }
  return context;
}
