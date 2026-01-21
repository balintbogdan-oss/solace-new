'use client';

import { ReportTable } from '@/components/reports/ReportTable';
import { maturityScheduleReport } from '@/data/maturity-schedule';
import { toClientReport } from '@/data/types';

export function MaturityScheduleTable() {
  const report = toClientReport(maturityScheduleReport);
  
  return <ReportTable report={report} />;
} 