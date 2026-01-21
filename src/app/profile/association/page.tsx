'use client';

import { Card } from '@/components/ui/card';

export default function AssociationPage() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Association</h1>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Are you associated with a broker-dealer?</label>
            <p className="text-base">No</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Are you a control person?</label>
            <p className="text-base">No</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Are you a political exposed person?</label>
            <p className="text-base">No</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

