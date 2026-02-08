import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { useGlobalFilters } from '../../hooks/useGlobalFilters';
import { cn } from '@/lib/utils';
import { dimJobs } from '../../data/analyticsSchema';

export default function GlobalFilterBar() {
  const { filters, updateFilters, clearFilters } = useGlobalFilters();

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px] space-y-2">
          <Label>Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !filters.dateRange && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange || 'Select date range'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3 space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => updateFilters({ dateRange: 'Last 7 days' })}
                >
                  Last 7 days
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => updateFilters({ dateRange: 'Last 30 days' })}
                >
                  Last 30 days
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => updateFilters({ dateRange: 'Last 90 days' })}
                >
                  Last 90 days
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => updateFilters({ dateRange: 'This year' })}
                >
                  This year
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex-1 min-w-[200px] space-y-2">
          <Label>Recruiter</Label>
          <Select value={filters.recruiter || 'all'} onValueChange={(value) => updateFilters({ recruiter: value === 'all' ? undefined : value })}>
            <SelectTrigger>
              <SelectValue placeholder="All recruiters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All recruiters</SelectItem>
              <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
              <SelectItem value="mike-chen">Mike Chen</SelectItem>
              <SelectItem value="emily-rodriguez">Emily Rodriguez</SelectItem>
              <SelectItem value="david-kim">David Kim</SelectItem>
              <SelectItem value="lisa-patel">Lisa Patel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[200px] space-y-2">
          <Label>Client</Label>
          <Select value={filters.client || 'all'} onValueChange={(value) => updateFilters({ client: value === 'all' ? undefined : value })}>
            <SelectTrigger>
              <SelectValue placeholder="All clients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All clients</SelectItem>
              <SelectItem value="techcorp-inc">TechCorp Inc</SelectItem>
              <SelectItem value="finance-co">Finance Co</SelectItem>
              <SelectItem value="health-systems">Health Systems</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[200px] space-y-2">
          <Label>Job</Label>
          <Select value={filters.job || 'all'} onValueChange={(value) => updateFilters({ job: value === 'all' ? undefined : value })}>
            <SelectTrigger>
              <SelectValue placeholder="All jobs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All jobs</SelectItem>
              {dimJobs.map((job) => (
                <SelectItem key={job.job_id} value={job.job_id}>
                  {job.job_title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" size="icon" onClick={clearFilters}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
