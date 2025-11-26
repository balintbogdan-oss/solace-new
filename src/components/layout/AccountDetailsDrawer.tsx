'use client';

import { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAccountData } from '@/contexts/AccountDataContext';
import { formatAccountType } from '@/lib/utils';

interface AccountDetailsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  accountId?: string; // Optional since we get data from context
}

export function AccountDetailsDrawer({ isOpen, onOpenChange }: AccountDetailsDrawerProps) {
  const { data: accountData } = useAccountData();
  const [showSSN, setShowSSN] = useState(false);

  if (!accountData) {
    return null;
  }

  const client = accountData.client;
  
  // Type guard for client with optional fields
  const clientWithExtras = client as typeof client & { dob?: string; ssn?: string };

  // Format date of birth
  const formatDOB = (dob: string) => {
    if (!dob) return 'N/A';
    const date = new Date(dob);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Calculate age
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Drawer direction="right" open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="h-full w-full max-w-2xl flex flex-col bg-card">
        <DrawerHeader className="p-6 border-b flex items-center justify-between flex-row">
          <DrawerTitle className="text-lg font-semibold">Account Details</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {/* Account Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Account Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Account ID</div>
                  <div className="text-sm font-medium">{accountData.accountId}</div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Account Name</div>
                  <div className="text-sm font-medium">{accountData.accountName}</div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Account Type</div>
                  <div className="text-sm font-medium">{formatAccountType(accountData.accountType)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Client Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Name</div>
                  <div className="text-sm font-medium">{client.firstName} {client.lastName}</div>
                </div>
              </div>

              {client.email && (
                <div className="flex items-start">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Email</div>
                    <div className="text-sm font-medium">{client.email}</div>
                  </div>
                </div>
              )}

              {client.phone && (
                <div className="flex items-start">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Phone</div>
                    <div className="text-sm font-medium">{client.phone}</div>
                  </div>
                </div>
              )}

              {clientWithExtras.dob && typeof clientWithExtras.dob === 'string' ? (
                <>
                  <div className="flex items-start">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-muted-foreground mb-1">DOB</div>
                      <div className="text-sm font-medium">{formatDOB(clientWithExtras.dob)}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-muted-foreground mb-1">Age</div>
                      <div className="text-sm font-medium">{calculateAge(clientWithExtras.dob)}</div>
                    </div>
                  </div>
                </>
              ) : null}

              {clientWithExtras.ssn && typeof clientWithExtras.ssn === 'string' ? (
                <div className="flex items-start">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-muted-foreground mb-1">SSN</div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">
                        {showSSN ? (clientWithExtras.ssn || '••••••••••') : '••••••••••'}
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

