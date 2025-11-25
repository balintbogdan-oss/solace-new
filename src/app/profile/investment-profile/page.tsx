'use client';

import { Card } from '@/components/ui/card';

export default function InvestmentProfilePage() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Investment profile</h1>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Investment objective</label>
            <p className="text-base">Growth</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Risk tolerance</label>
            <p className="text-base">Moderate</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Time horizon</label>
            <p className="text-base">10+ years</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Liquidity needs</label>
            <p className="text-base">Low</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Investment experience</label>
            <p className="text-base">5-10 years</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

