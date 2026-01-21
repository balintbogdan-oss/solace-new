'use client';

import { Card } from '@/components/ui/card';

export default function RealizedGLPage() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Realized G/L</h1>
        
        <div className="text-center py-12">
          <p className="text-muted-foreground">No realized gains/losses to display</p>
        </div>
      </Card>
    </div>
  );
}

