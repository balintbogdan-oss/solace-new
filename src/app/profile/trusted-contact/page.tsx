'use client';

import { Card } from '@/components/ui/card';

export default function TrustedContactPage() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Trusted contact</h1>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-3 block">
              Do you want to add a trusted contact?
            </label>
            <div className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <input type="radio" name="trusted-contact" value="yes" id="yes" defaultChecked className="w-4 h-4" />
                <label htmlFor="yes" className="text-base cursor-pointer">Yes</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" name="trusted-contact" value="no" id="no" className="w-4 h-4" />
                <label htmlFor="no" className="text-base cursor-pointer">No</label>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
              <label className="text-sm font-medium text-muted-foreground">Legal first name</label>
              <p className="text-base">Kaiya</p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
              <label className="text-sm font-medium text-muted-foreground">Legal last name</label>
              <p className="text-base">Botosh</p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
              <label className="text-sm font-medium text-muted-foreground">Country of address</label>
              <p className="text-base">United States</p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
              <label className="text-sm font-medium text-muted-foreground">Mailing address line 1</label>
              <p className="text-base">126 Acorn Street</p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
              <label className="text-sm font-medium text-muted-foreground">Mailing address line 2</label>
              <p className="text-base">Apt 4</p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
              <label className="text-sm font-medium text-muted-foreground">City</label>
              <p className="text-base">Happyville</p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
              <label className="text-sm font-medium text-muted-foreground">State</label>
              <p className="text-base">PE</p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
              <label className="text-sm font-medium text-muted-foreground">ZIP</label>
              <p className="text-base">12345</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

