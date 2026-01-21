'use client';

import { Card } from '@/components/ui/card';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      {/* Profile Summary Card */}
      <Card className="p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-3xl font-semibold text-white">J</span>
          </div>
          <h2 className="text-2xl font-semibold">Jim Robinson</h2>
        </div>
      </Card>

      {/* Personal Information Card */}
      <Card className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Personal information</h1>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Legal first name</label>
            <p className="text-base">Jim</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Legal middle name</label>
            <p className="text-base">Chance</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Legal last name</label>
            <p className="text-base">Robinson</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Date of birth</label>
            <p className="text-base">3/4/2000</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Country of legal residence</label>
            <p className="text-base">United States</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Taxpayer identification number</label>
            <p className="text-base">123-45-6789</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Marital status</label>
            <p className="text-base">Married</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <label className="text-sm font-medium text-muted-foreground">Number of dependents</label>
            <p className="text-base">0</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

