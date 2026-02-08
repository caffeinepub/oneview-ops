import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  UserProfile,
  UserRole,
  Organization,
  OrganizationType,
  Integration,
  SystemUserRecord,
  UserMapping,
  TimesheetRecord,
  Alert,
  Dashboard,
  Widget,
} from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['currentUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAssignUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignCallerUserRole(user, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
    },
  });
}

export function useAddOrganization() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, orgType }: { name: string; orgType: OrganizationType }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addOrganization(name, orgType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
}

export function useGetAllOrganizations() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Organization[]>({
    queryKey: ['organizations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrganizations();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdateIntegration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orgId, integration }: { orgId: Principal; integration: Integration }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateIntegration(orgId, integration);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
}

export function useAddUserMapping() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mapping: UserMapping) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addUserMapping(mapping);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userMappings'] });
    },
  });
}

export function useGetAllUserMappings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserMapping[]>({
    queryKey: ['userMappings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUserMappings();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddTimesheetRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: TimesheetRecord) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTimesheetRecord(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheetRecords'] });
    },
  });
}

export function useGetAllTimesheetRecords() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TimesheetRecord[]>({
    queryKey: ['timesheetRecords'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTimesheetRecords();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddAlert() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (alert: Alert) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addAlert(alert);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

export function useAcknowledgeAlert() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (alertId: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.acknowledgeAlert(alertId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

export function useGetAllAlerts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Alert[]>({
    queryKey: ['alerts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAlerts();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Dashboard Management Hooks
export function useCreateDashboard() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, widgets }: { name: string; widgets: Widget[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createDashboard(name, widgets);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
    },
  });
}

export function useUpdateDashboard() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ dashboardId, name, widgets }: { dashboardId: bigint; name: string; widgets: Widget[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateDashboard(dashboardId, name, widgets);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
    },
  });
}

export function useGetDashboard(dashboardId: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Dashboard>({
    queryKey: ['dashboard', dashboardId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDashboard(dashboardId);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllDashboards() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Dashboard[]>({
    queryKey: ['dashboards'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDashboards();
    },
    enabled: !!actor && !actorFetching,
  });
}
