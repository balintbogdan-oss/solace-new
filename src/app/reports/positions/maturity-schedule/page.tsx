'use client';

import { useState } from 'react';
import { ReportTable } from '@/components/reports/ReportTable';
import { maturityScheduleReport } from '@/data/maturity-schedule';
import { toClientReport } from '@/data/types';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MaturitySchedulePage() {
  const [timeRange, setTimeRange] = useState('30');
  const clientReport = toClientReport(maturityScheduleReport);

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    // TODO: Implement time range filtering
  };

  const handleRefresh = () => {
    // TODO: Implement refresh functionality
  };

  const handleExport = () => {
    // TODO: Implement export functionality
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif">Maturity Schedule</h1>
            <p className="mt-1 text-sm text-muted-foreground">View upcoming maturities across all accounts</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Updated {clientReport.metadata.lastUpdated.toLocaleString()}
            </div>
            <Select value={timeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="secondary" 
              size="icon"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="secondary" onClick={handleExport}>
              Export
            </Button>
          </div>
        </div>
       
           <ReportTable report={clientReport} /> 
       
      </div>
    </>
  );
}