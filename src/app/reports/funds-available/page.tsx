'use client';

import { ReportTable } from '@/components/reports/ReportTable';
import { fundsAvailableReport } from '@/data/funds-available';
import { ClientReport, ClientReportColumn } from '@/data/types';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

function transformToClientReport(): ClientReport {
  const { columns, data } = fundsAvailableReport;
  
  const metadata = {
    title: 'Funds Available',
    description: 'View available funds across all accounts',
    lastUpdated: new Date()
  };

  const clientColumns: ClientReportColumn[] = columns.map(column => {
    const baseColumn: ClientReportColumn = {
      key: column.key,
      header: column.header,
      width: column.width,
      align: column.align,
      type: 'string'
    };

    if (column.dataType === 'dateTime') {
      baseColumn.type = 'date';
      baseColumn.format = {
        type: 'date',
        options: {
          dateStyle: 'medium',
          timeStyle: 'short'
        }
      };
    } else if (column.dataType === 'number') {
      if (column.dataCategory === 'Currency') {
        baseColumn.type = 'currency';
        baseColumn.format = {
          type: 'currency',
          options: {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }
        };
      } else {
        baseColumn.type = 'number';
        baseColumn.format = { type: 'number' };
      }
    } else if (column.dataType === 'boolean') {
      baseColumn.type = 'boolean';
    }

    return baseColumn;
  });

  return {
    metadata,
    columns: clientColumns,
    data: data as unknown as Record<string, unknown>[],
    options: {
      showTimeRange: true,
      showSearch: true,
      showColumnCustomization: true,
      showExport: true,
      defaultTimeRange: '30'
    }
  };
}

type TimeRange = '7' | '30' | '90';

export default function FundsAvailablePage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30');
  const clientReport = transformToClientReport();
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(clientReport.metadata.lastUpdated.toLocaleString());
  }, [clientReport.metadata.lastUpdated]);

  const handleTimeRangeChange = (value: TimeRange) => {
    setTimeRange(value);
    handleRefresh();
  };

  const handleRefresh = () => {
    console.log('Refresh clicked');
    // Implement refresh logic here
  };

  const handleExport = () => {
    console.log('Export clicked');
    // Implement export logic here
  };

  const reportWithActions = {
    ...clientReport,
    actions: {
      onExport: handleExport,
      onRefresh: handleRefresh
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-serif tracking-tight">Funds Available</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View available funds across all accounts
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Updated {formattedDate}
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
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleExport}>
            Export
          </Button>
        </div>
      </div>
      
      <ReportTable report={reportWithActions} />
    </div>
  );
} 