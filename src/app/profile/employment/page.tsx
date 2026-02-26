'use client';

import { Card } from '@/components/ui/card';

export default function EmploymentPage() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Employment information</h1>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Employment type</label>
            <p className="text-base">Full time</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Occupation</label>
            <p className="text-base">Micro data refiner</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Type of business</label>
            <p className="text-base">Biotechnology</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Employer name</label>
            <p className="text-base">Lumon Industries</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Business address</label>
            <p className="text-base">123 Banana Post Lane</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">City</label>
            <p className="text-base">Slyphall</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">State</label>
            <p className="text-base">CA</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">ZIP</label>
            <p className="text-base">98765</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

