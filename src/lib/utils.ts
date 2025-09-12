import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format account type for display
export function formatAccountType(accountType: string): string {
  const typeMap: Record<string, string> = {
    'individual': 'Individual',
    'joint': 'Joint',
    'ira': 'IRA',
    'roth_ira': 'Roth IRA',
    '401k': '401(k)',
    '403b': '403(b)',
    'sep_ira': 'SEP IRA',
    'simple_ira': 'SIMPLE IRA',
    'trust': 'Trust',
    'corporate': 'Corporate',
    'partnership': 'Partnership',
    'llc': 'LLC',
    'custodian_minor': 'Custodian Minor/UTMA/UGMA',
    '529_plan': '529 Plan',
    '529_plan_utma': '529 Plan UTMA',
    'ira_shell': 'IRA Shell Account',
    'estate': 'Estate',
    'guardian_conservator_minor': 'Guardian/Conservator Minor',
    'guardian_conservator_incompetent': 'Guardian/Conservator Incompetent',
    'irrevocable_trust': 'Irrevocable Trust',
    'testamentary_trust': 'Testamentary Trust (Irrevocable)',
    'corporate_pension': 'Corporate Pension or Profit Sharing Plan (ERISA/Retirement Trust)',
    'single_account': 'Single Account (US Citizen/Resident Alien)',
    'joint_jtwros': 'Joint with Rights of Survivorship - JTWROS',
    'community_property': 'Community Property',
    'community_property_survivorship': 'Community Property W/Rights of Survivorship',
    'tenants_in_common': 'Tenants in Common',
    'revocable_trust': 'Revocable Trust',
    'other': 'Other'
  };
  
  return typeMap[accountType] || accountType;
}
