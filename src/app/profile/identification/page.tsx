'use client';

import { Card } from '@/components/ui/card';

export default function IdentificationPage() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Identification</h1>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Country of citizenship</label>
            <p className="text-base">United States</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Country of tax residence</label>
            <p className="text-base">United States</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Type of identification</label>
            <p className="text-base">Driver&apos;s License</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Front of ID</label>
            <p className="text-base">My ID 1.png</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Back of ID</label>
            <p className="text-base">My ID 2.png</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Identification #</label>
            <p className="text-base">84759810284</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Issue date</label>
            <p className="text-base">02/19/2024</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">State/country of issuance</label>
            <p className="text-base">United States</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Expiration date</label>
            <p className="text-base">02/20/2027</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

