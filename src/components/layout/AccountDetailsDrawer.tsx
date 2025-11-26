'use client';

import { useAccountData } from '@/contexts/AccountDataContext';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatAccountType } from '@/lib/utils';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface AccountDetailsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountDetailsDrawer({ isOpen, onOpenChange }: AccountDetailsDrawerProps) {
  const { data: accountData } = useAccountData();
  const [showSSN, setShowSSN] = useState(false);

  if (!accountData) return null;
  
  // Type guard for extended client fields (dob, ssn may exist but aren't in base Client type)
  const client = accountData.client as unknown as Record<string, unknown>;

  // Format date of birth
  const formatDOB = (dob?: string) => {
    if (!dob) return 'N/A';
    try {
      const date = new Date(dob);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dob;
    }
  };

  // Calculate age from DOB
  const calculateAge = (dob?: string) => {
    if (!dob) return 'N/A';
    try {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age.toString();
    } catch {
      return 'N/A';
    }
  };

  // Mock address - in real app this would come from account/client data
  const accountAddress = '390 Market Street, Suite 200, San Francisco CA';
  const clientAddress = accountAddress; // Same for now

  return (
    <Drawer direction="right" open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="h-full w-full max-w-2xl flex flex-col bg-card">
        <DrawerHeader className="flex flex-row items-center justify-between border-b pb-4 p-6">
          <DrawerTitle className="text-xl font-semibold">Details</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {/* Account Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Account information</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Account number</div>
                  <div className="text-sm font-medium">{accountData.accountId}</div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Account type</div>
                  <div className="text-sm font-medium">{formatAccountType(accountData.accountType)}</div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Account name</div>
                  <div className="text-sm font-medium break-words">{accountData.accountName}</div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Address</div>
                  <div className="text-sm font-medium break-words">{accountAddress}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t"></div>

          {/* Client Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Client information</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Client name</div>
                  <div className="text-sm font-medium">{accountData.client.firstName} {accountData.client.lastName}</div>
                </div>
              </div>

              {accountData.client.email && (
                <div className="flex items-start">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Email</div>
                    <a href={`mailto:${accountData.client.email}`} className="text-sm font-medium text-primary hover:underline break-all">
                      {accountData.client.email}
                    </a>
                  </div>
                </div>
              )}

              {accountData.client.phone && (
                <div className="flex items-start">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Phone</div>
                    <a href={`tel:${accountData.client.phone}`} className="text-sm font-medium text-primary hover:underline">
                      {accountData.client.phone}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Address</div>
                  <div className="text-sm font-medium break-words">{clientAddress}</div>
                </div>
              </div>

              {client.dob && typeof client.dob === 'string' ? (
                <div className="flex items-start">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-muted-foreground mb-1">DOB</div>
                    <div className="text-sm font-medium">{formatDOB(client.dob)}</div>
                  </div>
                </div>
              ) : null}

              {client.dob && typeof client.dob === 'string' ? (
                <div className="flex items-start">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Age</div>
                    <div className="text-sm font-medium">{calculateAge(client.dob)}</div>
                  </div>
                </div>
              ) : null}

              {client.ssn && typeof client.ssn === 'string' ? (
                <div className="flex items-start">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-muted-foreground mb-1">SSN</div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">
                        {showSSN ? (client.ssn || '••••••••••') : '••••••••••'}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setShowSSN(!showSSN)}
                      >
                        {showSSN ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

