import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowRight } from 'lucide-react';
import { parseQuery } from '../../utils/prototypeAiParser';
import { toast } from 'sonner';

export default function PrototypeAIGeneratorPanel() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<ReturnType<typeof parseQuery> | null>(null);
  const navigate = useNavigate();

  const handleGenerate = () => {
    if (!query.trim()) {
      toast.error('Please enter a query');
      return;
    }

    const parsed = parseQuery(query);
    setResult(parsed);
    toast.success('Dashboard template generated!');
  };

  const handleNavigate = () => {
    if (result) {
      navigate({ to: result.dashboardPath });
    }
  };

  const exampleQueries = [
    'Show recruiter productivity last month',
    'Leadership metrics for Q1',
    'Ops utilization this week',
    'Show interviews and offers by recruiter',
    'Revenue and margin for last quarter',
    'Active contractors this month',
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Textarea
          placeholder="e.g., Show recruiter productivity last month by client"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={3}
          className="resize-none"
        />
        <div className="flex flex-wrap gap-2">
          {exampleQueries.map((example) => (
            <Badge
              key={example}
              variant="outline"
              className="cursor-pointer hover:bg-accent"
              onClick={() => setQuery(example)}
            >
              {example}
            </Badge>
          ))}
        </div>
      </div>

      <Button onClick={handleGenerate} className="w-full">
        <Sparkles className="mr-2 h-4 w-4" />
        Generate Dashboard
      </Button>

      {result && (
        <Card className="p-4 bg-accent/50 border-accent">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold mb-1">Generated Template:</p>
              <p className="text-sm">{result.template}</p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">Inferred Filters:</p>
              <div className="flex flex-wrap gap-2">
                {result.filters.dateRange && (
                  <Badge variant="secondary">{result.filters.dateRange}</Badge>
                )}
                {result.filters.groupBy && (
                  <Badge variant="secondary">Group by: {result.filters.groupBy}</Badge>
                )}
              </div>
            </div>
            <Button onClick={handleNavigate} variant="outline" className="w-full">
              Open Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
