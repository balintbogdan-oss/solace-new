import { AccountData, Household } from '@/types/account';

export interface HouseholdGroup {
  household: Household | null;
  accounts: AccountData[];
  totalValue: number;
}

