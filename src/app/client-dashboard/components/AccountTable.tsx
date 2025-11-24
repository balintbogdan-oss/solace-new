import { AccountData } from '@/types/account';
import { formatCurrency } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface AccountTableProps {
  accounts: AccountData[];
  onAccountClick: (accountId: string) => void;
}

export function AccountTable({ accounts, onAccountClick }: AccountTableProps) {
  const getAccountTypeLabel = (accountType: string) => {
    switch (accountType) {
      case 'joint_jtwros':
        return 'Joint account';
      case 'trust':
        return 'Personal trust';
      case 'individual':
      case 'ira':
        return 'Single account';
      default:
        return 'Account';
    }
  };

  return (
    <>
      {/* Account Column */}
      <div className="flex flex-col items-start min-w-[120px] w-[300px] overflow-hidden">
        <div className="bg-muted flex gap-2 h-10 items-center min-w-[85px] px-6 py-0 w-full">
          <div className="flex-1 flex gap-2 items-center px-0 py-2">
            <p className="flex-1 text-sm font-medium text-muted-foreground leading-6">Account</p>
          </div>
        </div>
        {accounts.map((account) => (
          <div
            key={account.accountId}
            className="border-b border-t-0 border-l-0 border-r-0 flex gap-2 h-[72px] items-center min-w-[85px] pl-6 pr-0 py-2 w-full cursor-pointer hover:bg-muted/50"
            onClick={() => onAccountClick(account.accountId)}
          >
            <div className="flex-1 flex flex-col gap-0.5 items-start leading-0 min-w-0">
              <p className="text-sm font-medium text-foreground leading-6 truncate w-full">
                {getAccountTypeLabel(account.accountType)}
              </p>
              <p className="text-sm font-normal text-muted-foreground leading-4 truncate w-full">
                {account.accountId} • {account.accountName}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Cash + FDIC sweep Column */}
      <div className="flex-1 flex flex-col items-start overflow-hidden">
        <div className="bg-muted flex gap-2 h-10 items-center min-w-[85px] px-2 py-0 w-full">
          <div className="flex-1 flex gap-2 items-center justify-end px-0 py-2">
            <p className="flex-1 text-sm font-medium text-muted-foreground leading-6 text-right">Cash + FDIC sweep</p>
          </div>
        </div>
        {accounts.map((account) => (
          <div
            key={account.accountId}
            className="border-b border-t-0 border-l-0 border-r-0 flex h-[72px] items-center min-w-[85px] p-2 w-full cursor-pointer hover:bg-muted/50"
            onClick={() => onAccountClick(account.accountId)}
          >
            <p className="flex-1 text-sm font-medium text-foreground leading-6 text-right">
              {formatCurrency(account.balances?.cash || 0)}
            </p>
          </div>
        ))}
      </div>

      {/* Invested value Column */}
      <div className="flex flex-col items-start overflow-hidden w-[128px]">
        <div className="bg-muted flex gap-2 h-10 items-center min-w-[85px] px-2 py-0 w-full">
          <div className="flex-1 flex gap-2 items-center justify-end px-0 py-2">
            <p className="flex-1 text-sm font-medium text-muted-foreground leading-6 text-right">Invested value</p>
          </div>
        </div>
        {accounts.map((account) => (
          <div
            key={account.accountId}
            className="border-b border-t-0 border-l-0 border-r-0 flex h-[72px] items-center min-w-[85px] p-2 w-full cursor-pointer hover:bg-muted/50"
            onClick={() => onAccountClick(account.accountId)}
          >
            <p className="flex-1 text-sm font-medium text-foreground leading-6 text-right">
              {formatCurrency(account.balances?.investedValue || 0)}
            </p>
          </div>
        ))}
      </div>

      {/* Market value Column */}
      <div className="flex flex-col items-start overflow-hidden w-[137px]">
        <div className="bg-muted flex gap-2 h-10 items-center min-w-[85px] px-2 py-0 w-full">
          <div className="flex-1 flex gap-2 items-center justify-end px-0 py-2">
            <p className="flex-1 text-sm font-medium text-muted-foreground leading-6 text-right">Market value</p>
          </div>
        </div>
        {accounts.map((account) => (
          <div
            key={account.accountId}
            className="border-b border-t-0 border-l-0 border-r-0 flex h-[72px] items-center min-w-[85px] p-2 w-full cursor-pointer hover:bg-muted/50"
            onClick={() => onAccountClick(account.accountId)}
          >
            <p className="flex-1 text-sm font-medium text-foreground leading-6 text-right">
              {formatCurrency(account.balances?.totalValue || 0)}
            </p>
          </div>
        ))}
      </div>

      {/* Funds available Column */}
      <div className="flex flex-col items-start overflow-hidden w-[133px]">
        <div className="bg-muted flex gap-2 h-10 items-center min-w-[85px] px-2 py-0 w-full">
          <div className="flex-1 flex gap-2 items-center justify-end px-0 py-2">
            <p className="flex-1 text-sm font-medium text-muted-foreground leading-6 text-right">Funds available</p>
          </div>
        </div>
        {accounts.map((account) => (
          <div
            key={account.accountId}
            className="border-b border-t-0 border-l-0 border-r-0 flex h-[72px] items-center min-w-[85px] p-2 w-full cursor-pointer hover:bg-muted/50"
            onClick={() => onAccountClick(account.accountId)}
          >
            <p className="flex-1 text-sm font-medium text-foreground leading-6 text-right">
              {formatCurrency(account.balances?.buyingPower || 0)}
            </p>
          </div>
        ))}
      </div>

      {/* Margin balance Column */}
      <div className="flex flex-col items-start overflow-hidden w-[125px]">
        <div className="bg-muted flex gap-2 h-10 items-center min-w-[85px] px-2 py-0 w-full">
          <div className="flex-1 flex gap-2 items-center justify-end px-0 py-2">
            <p className="flex-1 text-sm font-medium text-muted-foreground leading-6 text-right">Margin balance</p>
          </div>
        </div>
        {accounts.map((account) => (
          <div
            key={account.accountId}
            className="border-b border-t-0 border-l-0 border-r-0 flex h-[72px] items-center min-w-[85px] p-2 w-full cursor-pointer hover:bg-muted/50"
            onClick={() => onAccountClick(account.accountId)}
          >
            <p className="flex-1 text-sm font-medium text-foreground leading-6 text-right">
              {formatCurrency(account.balances?.margin || 0)}
            </p>
          </div>
        ))}
      </div>

      {/* Total account value Column */}
      <div className="flex-1 flex flex-col items-start overflow-hidden">
        <div className="bg-muted flex gap-2 h-10 items-center min-w-[85px] px-2 py-0 w-full">
          <div className="flex-1 flex gap-2 items-center justify-end px-0 py-2">
            <p className="flex-1 text-sm font-medium text-muted-foreground leading-6 text-right">Total account value</p>
          </div>
        </div>
        {accounts.map((account) => (
          <div
            key={account.accountId}
            className="border-b border-t-0 border-l-0 border-r-0 flex h-[72px] items-center min-w-[85px] px-2 py-2 w-full cursor-pointer hover:bg-muted/50"
            onClick={() => onAccountClick(account.accountId)}
          >
            <p className="flex-1 text-sm font-medium text-foreground leading-6 text-right">
              {formatCurrency(account.balances?.totalValue || 0)}
            </p>
          </div>
        ))}
      </div>

      {/* Chevron Column */}
      <div className="flex flex-col items-start overflow-hidden w-[42px]">
        <div className="bg-muted flex gap-2 h-10 items-center px-2 py-0 w-full" />
        {accounts.map((account) => (
          <div
            key={account.accountId}
            className="border-b border-t-0 border-l-0 border-r-0 flex h-[72px] items-center justify-end p-2 w-full cursor-pointer hover:bg-muted/50"
            onClick={() => onAccountClick(account.accountId)}
          >
            <div className="flex gap-1 items-center">
              <div className="flex gap-2 h-9 items-center justify-center px-3 py-2.5 rounded-lg">
                <ChevronRight className="h-4 w-4 text-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

