import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function LoginGate() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <img
            src="/assets/generated/oneview-ops-logo.dim_512x512.png"
            alt="OneView Ops"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold tracking-tight">OneView Ops</h1>
          <p className="text-muted-foreground text-lg">
            Unified analytics for staffing and talent acquisition
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Sign in to access your dashboards and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="w-full"
              size="lg"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <img
            src="/assets/generated/oneview-ops-hero-illustration.dim_1600x900.png"
            alt="Analytics Dashboard"
            className="w-full rounded-lg shadow-lg mt-8"
          />
        </div>
      </div>
    </div>
  );
}
