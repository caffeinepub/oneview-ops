import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAssignUserRole } from '../../hooks/useQueries';
import { Principal } from '@dfinity/principal';
import { UserRole } from '../../backend';
import { toast } from 'sonner';
import { Shield } from 'lucide-react';

export default function AdminRoleAssignmentPage() {
  const [principalText, setPrincipalText] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.user);
  const assignRole = useAssignUserRole();

  const handleAssign = async () => {
    try {
      const principal = Principal.fromText(principalText);
      await assignRole.mutateAsync({ user: principal, role: selectedRole });
      toast.success('Role assigned successfully');
      setPrincipalText('');
    } catch (error) {
      toast.error('Failed to assign role. Check the principal format.');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Role Assignment</h1>
        <p className="text-muted-foreground">
          Assign roles to users for access control (Admin only)
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Assign User Role</CardTitle>
          </div>
          <CardDescription>
            Enter a principal ID and select a role. Changes take effect immediately.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="principal">Principal ID</Label>
            <Input
              id="principal"
              placeholder="xxxxx-xxxxx-xxxxx-xxxxx-xxx"
              value={principalText}
              onChange={(e) => setPrincipalText(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.admin}>Admin</SelectItem>
                <SelectItem value={UserRole.user}>User</SelectItem>
                <SelectItem value={UserRole.guest}>Guest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleAssign}
            disabled={!principalText || assignRole.isPending}
            className="w-full"
          >
            {assignRole.isPending ? 'Assigning...' : 'Assign Role'}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-sm space-y-2">
            <p className="font-semibold">Role Descriptions:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong>Admin:</strong> Full access to all features including role management</li>
              <li><strong>User:</strong> Access to dashboards, reports, and alerts</li>
              <li><strong>Guest:</strong> Limited read-only access</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
