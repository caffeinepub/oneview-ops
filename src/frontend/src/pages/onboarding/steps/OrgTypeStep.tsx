import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { Building2, Users } from 'lucide-react';
import { useOrgContext } from '../../../state/orgContext';
import type { OrganizationType } from '../../../backend';

export default function OrgTypeStep() {
  const { orgConfig, updateOrgConfig } = useOrgContext();

  const handleChange = (value: string) => {
    updateOrgConfig({ orgType: value as OrganizationType });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Select Your Organization Type</h3>
        <p className="text-sm text-muted-foreground">
          This will customize your dashboards and metrics to match your business model
        </p>
      </div>

      <RadioGroup value={orgConfig.orgType || ''} onValueChange={handleChange}>
        <Card className="p-4 cursor-pointer hover:border-primary transition-colors">
          <div className="flex items-start space-x-4">
            <RadioGroupItem value="staffing" id="staffing" />
            <Label htmlFor="staffing" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="font-semibold">Staffing Agency</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Focus on placements, fees, and revenue metrics. Track consultant performance
                and client relationships.
              </p>
            </Label>
          </div>
        </Card>

        <Card className="p-4 cursor-pointer hover:border-primary transition-colors">
          <div className="flex items-start space-x-4">
            <RadioGroupItem value="internalTA" id="internalTA" />
            <Label htmlFor="internalTA" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-semibold">Internal Talent Acquisition</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Focus on time-to-fill, hiring velocity, and recruiter efficiency. Track
                internal hiring pipelines.
              </p>
            </Label>
          </div>
        </Card>
      </RadioGroup>
    </div>
  );
}
