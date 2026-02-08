import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import IntegrationSettingsPanel from './IntegrationSettingsPanel';

interface ManageIntegrationDrawerProps {
  integrationId: string;
  onClose: () => void;
}

export default function ManageIntegrationDrawer({ integrationId, onClose }: ManageIntegrationDrawerProps) {
  const integrationNames: Record<string, string> = {
    loxo: 'Loxo',
    aircall: 'Aircall',
    timesheets: 'Timesheets',
  };

  return (
    <Sheet open onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Manage {integrationNames[integrationId]}</SheetTitle>
          <SheetDescription>
            Update connection settings and credentials
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <IntegrationSettingsPanel integrationId={integrationId} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
