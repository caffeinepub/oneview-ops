import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import OrgTypeStep from './steps/OrgTypeStep';
import ConnectLoxoStep from './steps/ConnectLoxoStep';
import ConnectAircallStep from './steps/ConnectAircallStep';
import ConnectTimesheetsStep from './steps/ConnectTimesheetsStep';
import UserMappingStep from './steps/UserMappingStep';
import ConfirmGenerateStep from './steps/ConfirmGenerateStep';
import { useOrgContext } from '../../state/orgContext';

const steps = [
  { id: 'orgType', title: 'Organization Type', component: OrgTypeStep },
  { id: 'loxo', title: 'Connect Loxo', component: ConnectLoxoStep },
  { id: 'aircall', title: 'Connect Aircall', component: ConnectAircallStep },
  { id: 'timesheets', title: 'Connect Timesheets', component: ConnectTimesheetsStep },
  { id: 'mapping', title: 'User Mapping', component: UserMappingStep },
  { id: 'confirm', title: 'Confirm & Generate', component: ConfirmGenerateStep },
];

export default function OnboardingWizardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { orgConfig } = useOrgContext();

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    navigate({ to: '/' });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!orgConfig.orgType;
      case 1:
        return orgConfig.integrations.loxo.connected;
      case 2:
        return orgConfig.integrations.aircall.connected;
      case 3:
        return orgConfig.integrations.timesheets.connected;
      default:
        return true;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome to OneView Ops</h1>
        <p className="text-muted-foreground">
          Let's set up your organization and connect your systems
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <CardDescription>
                Step {currentStep + 1} of {steps.length}
              </CardDescription>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <CurrentStepComponent />

          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            {currentStep === steps.length - 1 ? (
              <Button onClick={handleComplete}>
                Complete Setup
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
