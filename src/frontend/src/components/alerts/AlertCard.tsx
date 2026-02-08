import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AlertTriangle, Info, CheckCircle2, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

interface Alert {
  id: number;
  severity: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  rule: string;
  impactedEntity: string;
  timestamp: string;
  acknowledged: boolean;
  dashboardLink?: string;
}

interface AlertCardProps {
  alert: Alert;
  onAcknowledge: (id: number) => void;
  onDismiss: (id: number) => void;
}

export default function AlertCard({ alert, onAcknowledge, onDismiss }: AlertCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const severityConfig = {
    high: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
    medium: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    low: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  };

  const config = severityConfig[alert.severity];
  const Icon = config.icon;

  return (
    <Card className={alert.acknowledged ? 'opacity-60' : ''}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Icon className={`h-5 w-5 ${config.color} shrink-0 mt-0.5`} />
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold">{alert.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                  {alert.severity}
                </Badge>
                {alert.acknowledged && (
                  <Badge variant="outline" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Acknowledged
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{alert.impactedEntity}</span>
              <span>•</span>
              <span>{alert.timestamp}</span>
            </div>

            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  Why am I seeing this?
                  <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="p-3 bg-muted rounded-lg text-sm">
                  <p className="font-semibold mb-1">Detection Rule:</p>
                  <p className="text-muted-foreground">{alert.rule}</p>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="flex gap-2 pt-2">
              {!alert.acknowledged && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAcknowledge(alert.id)}
                >
                  Acknowledge
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDismiss(alert.id)}
              >
                <X className="h-4 w-4 mr-1" />
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
