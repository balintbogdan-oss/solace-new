'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/contexts/UserRoleContext';
import { localDataService } from '@/services/localDataService';

interface AccountAccessGuardProps {
  accountId: string;
  children: React.ReactNode;
}

export function AccountAccessGuard({ accountId, children }: AccountAccessGuardProps) {
  const router = useRouter();
  const { role, isHydrated } = useUserRole();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const verifyClientAccess = useCallback(async () => {
    try {
      // Get the current client ID (in production, this would come from auth)
      const currentClientId = 'client-1'; // TODO: Get from auth context
      
      // Get account data
      const accountData = await localDataService.getAccountData(accountId);
      
      if (!accountData) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      // Check if the account belongs to the current client
      if (accountData.clientId === currentClientId) {
        setHasAccess(true);
      } else {
        setHasAccess(false);
        // Redirect to client dashboard
        router.push('/client-dashboard');
      }
    } catch (error) {
      console.error('Error verifying account access:', error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  }, [accountId, router]);

  useEffect(() => {
    if (!isHydrated) return;

    // If user is an advisor, they have access to all accounts
    if (role === 'advisor') {
      setHasAccess(true);
      setLoading(false);
      return;
    }

    // If user is a client, verify they own this account
    if (role === 'client') {
      verifyClientAccess();
    }
  }, [role, isHydrated, verifyClientAccess]);

  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header Skeleton */}
        <div className="h-[54px] bg-card border-b">
          <div className="px-6 h-full flex items-center">
            <div className="h-4 w-48 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
        {/* Main Content Skeleton */}
        <div className="flex h-[calc(100vh-54px)]">
          {/* Sidebar Skeleton */}
          <div className="w-60 border-r bg-card">
            <div className="p-4 space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          </div>
          {/* Content Skeleton */}
          <div className="flex-1 px-8 py-8">
            <div className="space-y-4">
              <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 h-64 bg-muted rounded animate-pulse"></div>
                <div className="h-64 bg-muted rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (hasAccess === false) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don&apos;t have access to this account.</p>
          <button
            onClick={() => router.push('/client-dashboard')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

