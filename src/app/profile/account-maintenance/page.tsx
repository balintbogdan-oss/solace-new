'use client';

import { Card } from '@/components/ui/card';

export default function AccountMaintenancePage() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Account maintenance</h1>
        
        <div className="text-center py-12">
          <p className="text-muted-foreground">Account maintenance options will be available here</p>
        </div>
      </Card>
    </div>
  );
}

