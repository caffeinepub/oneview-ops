import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import LoginGate from './components/auth/LoginGate';
import ProfileSetup from './components/auth/ProfileSetup';
import AppShell from './components/layout/AppShell';
import OnboardingWizardPage from './pages/onboarding/OnboardingWizardPage';
import IntegrationsPage from './pages/integrations/IntegrationsPage';
import LoxoIntegrationPage from './pages/integrations/LoxoIntegrationPage';
import UserMappingPage from './pages/mapping/UserMappingPage';
import LeadershipDashboardPage from './pages/dashboards/LeadershipDashboardPage';
import RecruiterDashboardPage from './pages/dashboards/RecruiterDashboardPage';
import OpsHrDashboardPage from './pages/dashboards/OpsHrDashboardPage';
import AllMetricsDashboardPage from './pages/dashboards/AllMetricsDashboardPage';
import DashboardHubPage from './pages/dashboards/DashboardHubPage';
import CustomDashboardBuilderPage from './pages/dashboards/CustomDashboardBuilderPage';
import CustomDashboardPage from './pages/dashboards/CustomDashboardPage';
import FunnelAnalysisPage from './pages/analysis/FunnelAnalysisPage';
import ReportsAndExportsPage from './pages/reports/ReportsAndExportsPage';
import AlertsPage from './pages/alerts/AlertsPage';
import AdminRoleAssignmentPage from './pages/admin/AdminRoleAssignmentPage';
import LeaderboardsPage from './pages/leaderboards/LeaderboardsPage';
import DataHealthDashboardPage from './pages/data-health/DataHealthDashboardPage';
import { Toaster } from '@/components/ui/sonner';

function Layout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardHubPage,
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding',
  component: OnboardingWizardPage,
});

const integrationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/integrations',
  component: IntegrationsPage,
});

const loxoIntegrationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/integrations/loxo',
  component: LoxoIntegrationPage,
});

const userMappingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/user-mapping',
  component: UserMappingPage,
});

const leadershipDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/leadership',
  component: LeadershipDashboardPage,
});

const recruiterDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/recruiter',
  component: RecruiterDashboardPage,
});

const opsDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/ops',
  component: OpsHrDashboardPage,
});

const allMetricsDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/all-metrics',
  component: AllMetricsDashboardPage,
});

const customDashboardBuilderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/custom/new',
  component: CustomDashboardBuilderPage,
});

const customDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/custom/$dashboardId',
  component: CustomDashboardPage,
});

const leaderboardsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leaderboards',
  component: LeaderboardsPage,
});

const dataHealthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/data-health',
  component: DataHealthDashboardPage,
});

const funnelAnalysisRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/analysis/funnel',
  component: FunnelAnalysisPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: ReportsAndExportsPage,
});

const alertsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/alerts',
  component: AlertsPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/roles',
  component: AdminRoleAssignmentPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  onboardingRoute,
  integrationsRoute,
  loxoIntegrationRoute,
  userMappingRoute,
  leadershipDashboardRoute,
  recruiterDashboardRoute,
  opsDashboardRoute,
  allMetricsDashboardRoute,
  customDashboardBuilderRoute,
  customDashboardRoute,
  leaderboardsRoute,
  dataHealthRoute,
  funnelAnalysisRoute,
  reportsRoute,
  alertsRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (!isAuthenticated) {
    return <LoginGate />;
  }

  if (showProfileSetup) {
    return <ProfileSetup />;
  }

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
