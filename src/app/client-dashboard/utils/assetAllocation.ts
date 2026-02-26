import { AccountData } from '@/types/account';
import { getChartColor } from '@/lib/chartColors';

export function getAssetClass(securityType: string): string {
  switch (securityType) {
    case 'mutual_fund':
      return 'Mutual funds';
    case 'equity':
    case 'etf':
      return 'Equities';
    case 'option':
      return 'Options';
    case 'bond':
      return 'Fixed income';
    default:
      return 'Other';
  }
}

export function calculateAssetAllocation(selectedAccounts: AccountData[]) {
  // Aggregate holdings from all selected accounts
  const allHoldings: Array<{ security: { type: string }; marketValue: number }> = [];
  
  selectedAccounts.forEach(account => {
    if (account.holdings && account.securities && account.marketData) {
      account.holdings.forEach(holding => {
        const security = account.securities.find(s => s.symbol === holding.symbol);
        const marketData = account.marketData.find(m => m.symbol === holding.symbol);
        if (security && marketData) {
          const marketValue = (marketData.currentPrice || 0) * holding.quantity;
          allHoldings.push({
            security: { type: security.type },
            marketValue
          });
        }
      });
    }
  });

  // Group by asset class
  const allocationMap = new Map<string, number>();
  allHoldings.forEach(holding => {
    const assetClass = getAssetClass(holding.security.type);
    const currentValue = allocationMap.get(assetClass) || 0;
    allocationMap.set(assetClass, currentValue + holding.marketValue);
  });

  // Convert to array and calculate percentages
  const totalValue = Array.from(allocationMap.values()).reduce((sum, val) => sum + val, 0);
  
  if (totalValue === 0) {
    // Fallback to hardcoded values if no holdings
    return [
      { name: 'Mutual funds', value: 44, color: getChartColor(1) },
      { name: 'Equities', value: 20, color: getChartColor(2) },
      { name: 'Options', value: 15, color: getChartColor(3) },
      { name: 'Fixed income', value: 15, color: getChartColor(4) },
      { name: 'Annuities', value: 5, color: getChartColor(5) },
      { name: 'Other', value: 1, color: getChartColor(6) },
    ];
  }

  // Map asset classes to colors in the correct order
  const assetClassOrder = ['Mutual funds', 'Equities', 'Options', 'Fixed income', 'Annuities', 'Other'];
  const data = assetClassOrder
    .filter(className => allocationMap.has(className))
    .map((className, index) => ({
      name: className,
      value: Math.round((allocationMap.get(className)! / totalValue) * 100),
      color: getChartColor(index + 1)
    }))
    .filter(item => item.value > 0); // Only include non-zero allocations

  // Add any other classes not in the standard list
  allocationMap.forEach((value, className) => {
    if (!assetClassOrder.includes(className)) {
      data.push({
        name: className,
        value: Math.round((value / totalValue) * 100),
        color: getChartColor(6)
      });
    }
  });

  return data.length > 0 ? data : [
    { name: 'Mutual funds', value: 44, color: getChartColor(1) },
    { name: 'Equities', value: 20, color: getChartColor(2) },
    { name: 'Options', value: 15, color: getChartColor(3) },
    { name: 'Fixed income', value: 15, color: getChartColor(4) },
    { name: 'Annuities', value: 5, color: getChartColor(5) },
    { name: 'Other', value: 1, color: getChartColor(6) },
  ];
}

