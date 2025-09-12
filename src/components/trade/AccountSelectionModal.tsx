'use client'

import { useState } from 'react';
import {
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"
import { Briefcase } from "lucide-react"
import { Input } from "@/components/ui/input"

// Mock account data - replaced with a larger generated list
const generateMockAccounts = (count: number) => {
  const accounts = [];
  const accountTypes = ['Cash', 'Margin', 'IRA', '401k', 'Trust', 'Brokerage'];
  const namePrefixes = ['Personal', 'Joint', 'Trading', 'Retirement', 'Investment', 'Managed', 'College Savings', 'Estate'];
  const nameSuffixes = ['Fund', 'Account', 'Portfolio', 'Holdings'];

  for (let i = 1; i <= count; i++) {
    const type = accountTypes[Math.floor(Math.random() * accountTypes.length)];
    const prefix = namePrefixes[Math.floor(Math.random() * namePrefixes.length)];
    const suffix = nameSuffixes[Math.floor(Math.random() * nameSuffixes.length)];
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const typePrefix = type.substring(0, 2).toUpperCase();
    
    accounts.push({
      id: `${typePrefix}${randomDigits}${i}`,
      name: `${prefix} ${suffix} ${i}`,
      type: type,
      balance: Math.random() * 5000000 + 1000, // Random balance between 1k and 5M
    });
  }
  return accounts;
};

// Define specific accounts based on the image
const specificAccounts = [
  { id: '1PB10001', name: 'Jim & Alexa Brokerage', type: 'Brokerage', balance: 550123.45 },
  { id: '1PB10002', name: "Jim's 401K BROK", type: '401k', balance: 321987.65 },
  { id: '1PB10003', name: 'Kaiya and Jim Robinson INV', type: 'Investment', balance: 120500.00 },
  { id: '1PB10004', name: "Jim's general investment", type: 'Investment', balance: 75800.20 },
];

// Generate random accounts and combine with specific ones
const generatedAccounts = generateMockAccounts(46); // Adjusted count to 46
const MOCK_ACCOUNTS = [...specificAccounts, ...generatedAccounts];

interface AccountSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAccountSelect: (accountId: string) => void;
  recentAccountIds?: string[];
}

export function AccountSelectionModal({ 
  isOpen, 
  onOpenChange, 
  onAccountSelect,
  recentAccountIds = []
}: AccountSelectionModalProps) {

  const [searchTerm, setSearchTerm] = useState('');

  const handleSelect = (accountId: string) => {
    onAccountSelect(accountId);
    onOpenChange(false); // Close modal after selection
  };

  const filteredAccounts = MOCK_ACCOUNTS.filter(account => 
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentlyViewedAccounts = MOCK_ACCOUNTS.filter(account => 
    recentAccountIds.includes(account.id)
  );

  const accountsToShow = searchTerm
    ? filteredAccounts
    : recentAccountIds.length > 0
    ? recentlyViewedAccounts
    : MOCK_ACCOUNTS;

  const showRecentTitle = !searchTerm && recentAccountIds.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[40vh] overflow-y-hidden backdrop-blur-xl bg-card-blend dark:bg-black/50">
        <DialogHeader>
          <DialogTitle>Select Account</DialogTitle>
          <DialogDescription>
            Choose the account you want to use for this trade.
          </DialogDescription>
        </DialogHeader>
        <div className="px-4 pt-2 pb-0">
          <Input 
            placeholder="Search accounts by name, ID, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="grid gap-4 py-4">
          {showRecentTitle && (
            <h4 className="px-3 text-sm font-medium text-muted-foreground">
              Recently Viewed
            </h4>
          )}
          {accountsToShow.map((account) => (
            <button
              key={account.id}
              onClick={() => handleSelect(account.id)}
              className="flex items-center justify-between w-full p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{account.name}</p>
                  <p className="text-sm text-muted-foreground">{account.id} ({account.type})</p>
                </div>
              </div>
              <span className="font-mono text-sm">
                ${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 