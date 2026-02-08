import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { generateUserMappings } from '../../data/sampleData';

export default function UserMappingPage() {
  const mappings = generateUserMappings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">User Mapping</h1>
        <p className="text-muted-foreground">
          View and manage user mappings across Loxo, Aircall, and Timesheet systems
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cross-System User Mappings</CardTitle>
          <CardDescription>
            Users automatically matched by email address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Loxo ID</TableHead>
                <TableHead>Aircall ID</TableHead>
                <TableHead>Timesheet ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappings.map((mapping, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    {mapping.autoMatched ? (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Auto-matched
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Manual review
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{mapping.canisterUser}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{mapping.email}</TableCell>
                  <TableCell className="font-mono text-sm">{mapping.loxoUserId}</TableCell>
                  <TableCell className="font-mono text-sm">{mapping.aircallUserId}</TableCell>
                  <TableCell className="font-mono text-sm">{mapping.timesheetUserId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
