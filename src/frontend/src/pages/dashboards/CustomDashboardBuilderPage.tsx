import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { useCreateDashboard } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { widgetLibrary } from '../../utils/dashboardWidgetLibrary';
import type { Widget } from '../../backend';

export default function CustomDashboardBuilderPage() {
  const navigate = useNavigate();
  const createDashboard = useCreateDashboard();
  const [dashboardName, setDashboardName] = useState('');
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);

  const handleToggleWidget = (widgetId: string) => {
    setSelectedWidgets((prev) =>
      prev.includes(widgetId)
        ? prev.filter((id) => id !== widgetId)
        : [...prev, widgetId]
    );
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newWidgets = [...selectedWidgets];
    [newWidgets[index - 1], newWidgets[index]] = [newWidgets[index], newWidgets[index - 1]];
    setSelectedWidgets(newWidgets);
  };

  const handleMoveDown = (index: number) => {
    if (index === selectedWidgets.length - 1) return;
    const newWidgets = [...selectedWidgets];
    [newWidgets[index], newWidgets[index + 1]] = [newWidgets[index + 1], newWidgets[index]];
    setSelectedWidgets(newWidgets);
  };

  const handleRemove = (widgetId: string) => {
    setSelectedWidgets((prev) => prev.filter((id) => id !== widgetId));
  };

  const handleSave = async () => {
    if (!dashboardName.trim()) {
      toast.error('Please enter a dashboard name');
      return;
    }

    if (selectedWidgets.length === 0) {
      toast.error('Please select at least one widget');
      return;
    }

    const widgets: Widget[] = selectedWidgets.map((widgetId) => {
      const widgetDef = widgetLibrary.find((w) => w.id === widgetId);
      return {
        id: BigInt(0), // Will be assigned by backend
        widgetType: widgetDef!.widgetType,
        config: JSON.stringify({ metricId: widgetId, ...widgetDef!.config }),
      };
    });

    try {
      const dashboardId = await createDashboard.mutateAsync({
        name: dashboardName,
        widgets,
      });
      toast.success('Dashboard created successfully');
      navigate({ to: `/dashboard/custom/${dashboardId}` });
    } catch (error) {
      toast.error('Failed to create dashboard');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold mb-2">Create Custom Dashboard</h1>
          <p className="text-muted-foreground">
            Select widgets and arrange them to build your personalized dashboard
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Dashboard Configuration</CardTitle>
            <CardDescription>Name your dashboard and select widgets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="dashboard-name">Dashboard Name</Label>
              <Input
                id="dashboard-name"
                placeholder="e.g., My Performance Dashboard"
                value={dashboardName}
                onChange={(e) => setDashboardName(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <Label>Available Widgets</Label>
              <div className="grid gap-3">
                {widgetLibrary.map((widget) => (
                  <div
                    key={widget.id}
                    className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <Checkbox
                      id={widget.id}
                      checked={selectedWidgets.includes(widget.id)}
                      onCheckedChange={() => handleToggleWidget(widget.id)}
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={widget.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {widget.label}
                      </label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {widget.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Selected Widgets</CardTitle>
              <CardDescription>
                {selectedWidgets.length} widget{selectedWidgets.length !== 1 ? 's' : ''} selected
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedWidgets.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No widgets selected yet
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedWidgets.map((widgetId, index) => {
                    const widget = widgetLibrary.find((w) => w.id === widgetId);
                    return (
                      <div
                        key={widgetId}
                        className="flex items-center gap-2 p-2 border rounded-lg"
                      >
                        <span className="flex-1 text-sm">{widget?.label}</span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleMoveDown(index)}
                            disabled={index === selectedWidgets.length - 1}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleRemove(widgetId)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1" disabled={createDashboard.isPending}>
              {createDashboard.isPending ? 'Creating...' : 'Create Dashboard'}
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: '/' })}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
