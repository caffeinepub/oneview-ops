import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateUserMappings } from '../../../data/sampleData';
import { CheckCircle2 } from 'lucide-react';

export default function UserMappingStep() {
  const mappings = generateUserMappings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">User Mapping</h2>
        <p className="text-muted-foreground">
          We've automatically matched users across your systems using email addresses
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Auto-Matched Users</CardTitle>
          <CardDescription>
            {mappings.length} users successfully matched across Loxo, Aircall, and Timesheets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mappings.map((mapping, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                  <div>
                    <p className="font-medium">{mapping.canisterUser}</p>
                    <p className="text-sm text-muted-foreground">{mapping.email}</p>
                  </div>
                </div>
                <Badge variant="secondary">Matched</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
