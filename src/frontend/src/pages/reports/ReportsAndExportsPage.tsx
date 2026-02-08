import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, FileSpreadsheet, Presentation, Download, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useGlobalFilters } from '../../hooks/useGlobalFilters';
import { exportToCSV, exportToPDF, exportToPPT } from '../../utils/exporters';
import { generateAIReport } from '../../utils/aiReports';
import AIReportRenderer from '../../components/reports/AIReportRenderer';
import { toast } from 'sonner';

export default function ReportsAndExportsPage() {
  const [selectedDashboard, setSelectedDashboard] = useState('leadership');
  const [aiQuery, setAiQuery] = useState('');
  const [aiReport, setAiReport] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { filters } = useGlobalFilters();

  const handleExport = async (format: 'csv' | 'pdf' | 'ppt') => {
    try {
      switch (format) {
        case 'csv':
          await exportToCSV(selectedDashboard, filters);
          break;
        case 'pdf':
          await exportToPDF(selectedDashboard, filters);
          break;
        case 'ppt':
          await exportToPPT(selectedDashboard, filters);
          break;
      }
      toast.success(`${format.toUpperCase()} export completed`);
    } catch (error) {
      toast.error(`Export failed: ${error}`);
    }
  };

  const handleGenerateAIReport = () => {
    if (!aiQuery.trim()) {
      toast.error('Please enter a query');
      return;
    }

    setIsGenerating(true);
    
    // Simulate processing delay for better UX
    setTimeout(() => {
      const report = generateAIReport(aiQuery, filters);
      setAiReport(report);
      setIsGenerating(false);
      toast.success('Report generated');
    }, 800);
  };

  const exampleQueries = [
    'Why did placements drop last month?',
    'Who has the best ROI per hour?',
    'Which jobs are burning most effort?',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Reports & Exports</h1>
        <p className="text-muted-foreground">
          Export dashboards and generate AI-powered insights
        </p>
      </div>

      <Tabs defaultValue="exports">
        <TabsList>
          <TabsTrigger value="exports">Exports</TabsTrigger>
          <TabsTrigger value="ai-reports">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="exports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Dashboard</CardTitle>
              <CardDescription>
                Select a dashboard and export format. Exports respect your current filters.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="dashboard-select">Select Dashboard</Label>
                <Select value={selectedDashboard} onValueChange={setSelectedDashboard}>
                  <SelectTrigger id="dashboard-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leadership">Leadership Dashboard</SelectItem>
                    <SelectItem value="recruiter">Recruiter Dashboard</SelectItem>
                    <SelectItem value="ops">Ops/HR Dashboard</SelectItem>
                    <SelectItem value="funnel">Funnel Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleExport('csv')}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <FileSpreadsheet className="h-12 w-12 text-primary" />
                      <h3 className="font-semibold">CSV Export</h3>
                      <p className="text-sm text-muted-foreground">
                        Raw data with headers
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleExport('pdf')}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <FileText className="h-12 w-12 text-primary" />
                      <h3 className="font-semibold">PDF Export</h3>
                      <p className="text-sm text-muted-foreground">
                        Formatted report
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Download className="mr-2 h-4 w-4" />
                        Export PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleExport('ppt')}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <Presentation className="h-12 w-12 text-primary" />
                      <h3 className="font-semibold">PPT Export</h3>
                      <p className="text-sm text-muted-foreground">
                        Presentation slides
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Download className="mr-2 h-4 w-4" />
                        Export PPT
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI-Powered Reports
              </CardTitle>
              <CardDescription>
                Ask questions about your data and get structured insights with KPIs, charts, and narratives
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-query">Ask a question</Label>
                <div className="flex gap-2">
                  <Input
                    id="ai-query"
                    placeholder="e.g., Why did placements drop last month?"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateAIReport()}
                  />
                  <Button onClick={handleGenerateAIReport} disabled={isGenerating}>
                    {isGenerating ? 'Generating...' : 'Generate'}
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Try:</span>
                {exampleQueries.map((query, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAiQuery(query);
                      setTimeout(() => handleGenerateAIReport(), 100);
                    }}
                  >
                    {query}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {aiReport && <AIReportRenderer report={aiReport} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
