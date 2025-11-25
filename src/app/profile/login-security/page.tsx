'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

export default function LoginSecurityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Login & security</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Show email & phone
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Login email address */}
          <div className="flex items-center justify-between pb-6 border-b">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Login email address</label>
              <p className="mt-1 text-base">j••••@gmail.com</p>
            </div>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>

          {/* Password */}
          <div className="flex items-center justify-between pb-6 border-b">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Password</label>
              <p className="mt-1 text-base text-muted-foreground">Last updated 1 year ago</p>
            </div>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>

          {/* Mobile phone number */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Mobile phone number</label>
              <p className="mt-1 text-base">xxx-xxx-1234</p>
            </div>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

