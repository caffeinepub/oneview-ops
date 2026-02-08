import { ReactNode } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserRole, useIsCallerAdmin } from '../../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Settings,
  Users,
  LogOut,
  Menu,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userRole } = useGetCallerUserRole();
  const { data: isAdmin } = useIsCallerAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentPath = routerState.location.pathname;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const navItems = [
    {
      label: 'Reports & Dashboards',
      icon: LayoutDashboard,
      path: '/',
      roles: ['admin', 'user'],
    },
    {
      label: 'Integrations',
      icon: Settings,
      path: '/integrations',
      roles: ['admin'],
    },
    {
      label: 'User Mapping',
      icon: Users,
      path: '/user-mapping',
      roles: ['admin'],
    },
    {
      label: 'Admin',
      icon: Shield,
      path: '/admin/roles',
      roles: ['admin'],
    },
  ];

  const visibleNavItems = navItems.filter((item) => {
    if (isAdmin) return true;
    return item.roles.includes(userRole || 'guest');
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-16 items-center px-4 gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/oneview-ops-logo.dim_512x512.png"
              alt="OneView Ops"
              className="h-8 w-8"
            />
            <span className="font-bold text-xl hidden sm:inline">OneView Ops</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-card transition-transform duration-200',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
        >
          <nav className="flex flex-col gap-1 p-4">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'justify-start',
                    isActive && 'bg-accent text-accent-foreground'
                  )}
                  onClick={() => navigate({ to: item.path })}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card mt-auto">
        <div className="container flex h-14 items-center justify-center text-sm text-muted-foreground">
          © 2026. Built with ❤️ using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 font-medium hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
