'use client'

export const dynamic = 'force-dynamic';

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Download, Eye, ChevronDown } from 'lucide-react'

export default function PerformancePage() {
  const [selectedYear, setSelectedYear] = useState('2024')

  // Mock data for performance reports
  const performanceReports = [
    { period: 'Q4 2024', type: 'Quarterly Performance Report' },
    { period: 'Q3 2024', type: 'Quarterly Performance Report' },
    { period: 'Q2 2024', type: 'Quarterly Performance Report' },
    { period: 'Q1 2024', type: 'Quarterly Performance Report' },
    { period: 'Annual 2023', type: 'Annual Performance Report' },
    { period: 'Q4 2023', type: 'Quarterly Performance Report' },
  ]

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium font-serif text-slate-900 dark:text-slate-100">Performance</h1>
        </div>

        {/* Year selector and download all */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-20 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="h-9">
            <Download className="w-4 h-4 mr-2" />
            Download all {selectedYear}
          </Button>
        </div>

        {/* Performance reports table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50">
                  <button className="flex items-center gap-1 w-full">
                    <span className="text-xs">Period</span>
                    <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                  </button>
                </th>
                <th className="text-left px-6 py-3 font-medium text-muted-foreground whitespace-nowrap">
                  <span className="text-xs">Type</span>
                </th>
                <th className="text-right px-6 py-3 font-medium text-muted-foreground whitespace-nowrap">
                  <span className="text-xs">Download/View</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {performanceReports.map((report, index) => (
                <tr key={`${report.period}-${report.type}`} className={`border-b ${index % 2 === 1 ? 'bg-card' : ''}`}>
                  <td className="px-6 py-3 text-foreground">
                    {report.period}
                  </td>
                  <td className="px-6 py-3 text-foreground">
                    {report.type}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
