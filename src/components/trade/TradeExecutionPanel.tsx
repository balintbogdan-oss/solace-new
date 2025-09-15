'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Check, ChevronDown, ChevronUp, X, CheckCircle } from 'lucide-react'
import { AccountSelectionModal } from './AccountSelectionModal'
import { cn, formatAccountType } from '@/lib/utils'
import { useAccountData } from '@/contexts/SupabaseAccountDataContext'
import { MarketDataOverlay } from './MarketDataOverlay'
import { OptionsMarketDataOverlay } from './OptionsMarketDataOverlay'
import { MutualFundMarketDataOverlay } from './MutualFundMarketDataOverlay'

// Mock data (Should ideally be fetched or passed as props)
// TODO: Replace with actual data fetching logic for price & account details
const STOCK_DATA: Record<string, { price: number; }> = {
  AAPL: { price: 230.45 },
  MSFT: { price: 405.12 },
  GOOGL: { price: 142.56 },
  NVDA: { price: 875.28 },
  VTSAX: { price: 125.60 },
  AMZN: { price: 165.45 },
  VFIAX: { price: 503.56 },
}

// Mock holdings data for demonstration
const MOCK_HOLDINGS: Record<string, { quantity: number; avgPrice: number; }> = {
  'AAPL': { quantity: 150, avgPrice: 185.50 },
  'MSFT': { quantity: 75, avgPrice: 380.25 },
  'GOOGL': { quantity: 50, avgPrice: 135.80 },
  'NVDA': { quantity: 25, avgPrice: 420.75 },
}

// Define a specific type for account types used in mock data
type MockAccountType = 'Brokerage' | 'Margin' | 'Cash' | '401k' | 'Investment';

// Update mock account type to include buying power
const MOCK_ACCOUNTS: Record<string, { name: string; type: MockAccountType; buyingPower?: number; }> = {
  '1PB10001': { name: "Jim & Alexa Brokerage", type: 'Brokerage', buyingPower: 125000.50 },
  '2TR20002': { name: 'Trading Account', type: 'Margin', buyingPower: 250000.00 },
  '3RA30003': { name: 'Retirement IRA', type: 'Cash', buyingPower: 50000.75 },
  '1PB10002': { name: "Jim's 401K BROK", type: '401k', buyingPower: 10000.00 }, // Buying power might be limited
  '1PB10003': { name: 'Kaiya and Jim Robinson INV', type: 'Investment', buyingPower: 500000.00 },
  '1PB10004': { name: "Jim's general investment", type: 'Investment', buyingPower: 75000.25 },
};

type OrderState = 'entry' | 'review' | 'confirmation'
type TradeMode = 'buy' | 'sell' | 'full-liquidation' | 'full-exchange' | 'partial-exchange' | null
type OrderType = 'market' | 'limit' | 'stop' | 'stop-limit'
type CommissionType = 'regular' | 'flatRate' | 'centsPerShare' | 'percentDiscount'
type TimeInForce = 'day' | 'gtc' | 'ioc' | 'gtd'
type OptionType = 'call' | 'put';
type OptionSellType = 'sellToClose' | 'sellToOpen' | 'sellNaked' | 'buyToClose';
type TaxAllocationMethod = 'FirstInFirstOut' | 'LastInFirstOut' | 'LowestCostFirstOut' | 'HighestCost' | 'LowestCostShortTerm' | 'LowestCostLongTerm' | 'HighestCostShortTerm' | 'HighestCostLongTerm' | 'MinimizeTaxImplications' | 'MaximumGain';

interface TradeExecutionPanelProps {
  symbol: string;
  accountId: string;
  initialTradeMode?: TradeMode;
  onClose?: () => void;
  // onAccountChange?: (newAccountId: string) => void;
  strikePrice?: number;
  optionType?: OptionType;
  limitPrice?: number;
  skipSegmentedControl?: boolean;
  // Explicitly indicate when we are rendering an options trade
  isOptionTradeOverride?: boolean;
}

export function TradeExecutionPanel({ 
  symbol, 
  accountId, 
  initialTradeMode = null, 
  onClose,
  // onAccountChange,
  strikePrice,
  optionType,
  limitPrice,
  skipSegmentedControl = false,
  isOptionTradeOverride
}: TradeExecutionPanelProps) {
  // --- Base States ---
  const [orderState, setOrderState] = useState<OrderState>('entry')
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [tradeMode, setTradeMode] = useState<TradeMode>(initialTradeMode)
  const [orderStatus, setOrderStatus] = useState<'filled' | 'pending'>('pending')
  
  const notesTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isReviewAdvancedOpen, setIsReviewAdvancedOpen] = useState(false);
  const [mutualFundTab, setMutualFundTab] = useState<'exchange' | 'optional'>('exchange');
  const isOptionTrade = useMemo(() => {
    if (typeof isOptionTradeOverride === 'boolean') {
      return isOptionTradeOverride;
    }
    return strikePrice !== undefined && optionType !== undefined;
  }, [isOptionTradeOverride, strikePrice, optionType]);

  // Function to detect if a symbol is a mutual fund
  const isMutualFund = useMemo(() => {
    const upperSymbol = symbol?.toUpperCase();
    return upperSymbol === 'VTSAX' || 
           upperSymbol === 'VFIAX' ||
           upperSymbol === 'VTSMX' ||
           false;
  }, [symbol]);

  // --- Form Field States ---
  const [accountType, setAccountType] = useState<'Cash' | 'Margin'>('Cash');
  const [orderType, setOrderType] = useState<OrderType>('market');
  const [quantity, setQuantity] = useState(0);
  const [currentLimitPrice, setCurrentLimitPrice] = useState<number>(limitPrice || 0);
  const [stopPrice, setStopPrice] = useState<number>(0);
  const [stopLimitPrice, setStopLimitPrice] = useState<number>(0);
  const [commissionType, setCommissionType] = useState<CommissionType>('regular');
  const [commissionAmount, setCommissionAmount] = useState<number>(0);
  // Deprecated placeholder; keeping logic explicit per-checkbox now
  // const [specialInstructions, setSpecialInstructions] = useState<string>('none');
  const [settlementType, setSettlementType] = useState<string>('regular');
  const [timeInForce, setTimeInForce] = useState<TimeInForce>('day');
  const [ttoRep, setTtoRep] = useState<string>('');
  const [sellerCode, setSellerCode] = useState<string>('Long-Stock');
  const [goodTillDate, setGoodTillDate] = useState<string>('');
  const [solicited, setSolicited] = useState<string>('-');
  const [discretion, setDiscretion] = useState<boolean>(false);
  const [notes, setNotes] = useState('');
  const [showValidation, setShowValidation] = useState(false);
  const [taxAllocationMethod, setTaxAllocationMethod] = useState<TaxAllocationMethod>('FirstInFirstOut');

  // Mutual Fund specific settings
  const [customerStatus, setCustomerStatus] = useState<string>('Existing');
  const [shareProcessing, setShareProcessing] = useState<string>('Regular');
  const [nav, setNav] = useState<string>('-');
  const [mutualFundDiscretion, setMutualFundDiscretion] = useState<string>('-');
  const [noCdsc, setNoCdsc] = useState<string>('-');
  const [loiRoaBreakpoint, setLoiRoaBreakpoint] = useState<string>('-');
  const [relatedAccountType, setRelatedAccountType] = useState<string>('-');
  const [distributionLongGains, setDistributionLongGains] = useState<string>('-');
  const [distributionShortGains, setDistributionShortGains] = useState<string>('-');
  const [network, setNetwork] = useState<boolean>(false);
  const [transactionType, setTransactionType] = useState<'even-dollar' | 'shares'>('shares');
  const [dollarAmount, setDollarAmount] = useState<number>(0);
  
  // Special Instructions state
  const [allOrNone, setAllOrNone] = useState<boolean>(false);
  const [notHeld, setNotHeld] = useState<boolean>(false);
  const [doNotIncrease, setDoNotIncrease] = useState<boolean>(false);
  const [doNotReduce, setDoNotReduce] = useState<boolean>(false);
  const [timeWeightedAveragePrice, setTimeWeightedAveragePrice] = useState<boolean>(false);
  const [volumeWeightedAveragePrice, setVolumeWeightedAveragePrice] = useState<boolean>(false);
  const [optionSellType, setOptionSellType] = useState<OptionSellType>('sellToClose');
  const [selectedOptionAction, setSelectedOptionAction] = useState<'buyToOpen' | 'sellToOpen'>('buyToOpen');

  const router = useRouter();

  // --- Account Data Context ---
  const { data: accountData, addHolding, removeHolding, addTrade, updateBalances, executeTrade } = useAccountData();
  const marketData = accountData?.marketData;

  // Check if user is holding the specific option
  // Derived info retained for future UX, but not used in the current flow
  // const isHoldingOption = useMemo(() => {
  //   if (!isOptionTrade || !accountData?.holdings) return false;
  //   const optionKey = `${symbol}_${strikePrice}_${optionType}`;
  //   return accountData.holdings.some(holding => 
  //     holding.symbol === optionKey && holding.quantity > 0
  //   );
  // }, [isOptionTrade, accountData?.holdings, symbol, strikePrice, optionType]);

  // --- Data and Memos ---
  const currentStock = useMemo(() => {
    const upperSymbol = symbol?.toUpperCase();
    const realMarketData = marketData?.find(m => m.symbol === upperSymbol);
    
    if (realMarketData) {
      return { price: realMarketData.currentPrice };
    } else {
      return STOCK_DATA[upperSymbol] || STOCK_DATA.AAPL;
    }
  }, [symbol, marketData]);

  // Set initial limit price when symbol or market data changes
  useEffect(() => {
    if (currentStock?.price && !limitPrice) {
      setCurrentLimitPrice(currentStock.price);
    }
  }, [currentStock?.price, limitPrice]);

  // Set default option action based on trade mode for option trades
  useEffect(() => {
    if (isOptionTrade) {
      if (skipSegmentedControl) {
        // Skip segmented control and go directly to appropriate close action
        if (tradeMode === 'buy') {
          setSelectedOptionAction('buyToOpen');
          setOptionSellType('buyToClose');
        } else {
          setSelectedOptionAction('sellToOpen');
          setOptionSellType('sellToClose');
        }
      } else if (tradeMode === 'buy') {
        setSelectedOptionAction('buyToOpen');
      } else if (tradeMode === 'sell') {
        setSelectedOptionAction('sellToOpen');
      }
    }
  }, [isOptionTrade, tradeMode, skipSegmentedControl]);

  // Set order type to market for mutual funds
  useEffect(() => {
    if (isMutualFund && orderType !== 'market') {
      setOrderType('market');
    }
  }, [isMutualFund, orderType]);
  
  const accountDetails = useMemo(() => {
    if (accountData) {
      return {
        name: accountData.accountName,
        type: accountData.accountType === 'individual' ? 'Individual' : 
              accountData.accountType || 'Individual',
        clientName: accountData.client ? `${accountData.client.firstName} ${accountData.client.lastName}` : 'Unknown Client'
      };
    }
    const mockAccount = MOCK_ACCOUNTS[accountId] || { name: 'Unknown Account', type: 'Individual' };
    return {
      name: mockAccount.name,
      type: mockAccount.type,
      clientName: 'Unknown Client'
    };
  }, [accountData, accountId]);

  // Get current holding for this symbol
  const currentHolding = useMemo(() => {
    if (!accountData?.holdings) return null;
    return accountData.holdings.find(h => h.symbol === symbol?.toUpperCase());
  }, [accountData?.holdings, symbol]);

  // Get available cash and buying power
  const availableCash = accountData?.balances?.cash || 0;
  const buyingPower = accountData?.balances?.buyingPower || 0;
  
  // Use database holdings if available, otherwise fall back to mock data
  const availableQuantity = currentHolding?.quantity || (symbol ? MOCK_HOLDINGS[symbol.toUpperCase()]?.quantity || 0 : 0);
  const marketPrice = currentStock.price;

  // Auto-calculate quantity for mutual fund even-dollar transactions
  useEffect(() => {
    if (isMutualFund && transactionType === 'even-dollar' && dollarAmount > 0 && marketPrice > 0) {
      const calculatedQuantity = Math.floor(dollarAmount / marketPrice);
      setQuantity(calculatedQuantity);
    } else if (isMutualFund && transactionType === 'even-dollar' && dollarAmount === 0) {
      setQuantity(0);
    }
  }, [isMutualFund, transactionType, dollarAmount, marketPrice]);
  const commission = useMemo(() => {
      if (quantity === 0) return 0;
      
      if (commissionType === 'regular') {
        return 10.00; // Hardcoded $10 commission
      } else if (commissionType === 'flatRate') {
        return commissionAmount;
      } else if (commissionType === 'centsPerShare') {
        return quantity * (commissionAmount / 100);
      } else if (commissionType === 'percentDiscount') {
        const baseValue = isOptionTrade ? quantity * currentLimitPrice * 100 : quantity * (orderType === 'limit' ? currentLimitPrice : marketPrice);
        const calculatedCommission = baseValue * 0.05; // 5% of trade value
        const discountedCommission = calculatedCommission * (1 - commissionAmount / 100);
        return Math.max(25.00, discountedCommission); // Minimum $25
      }
      
      return 0;
  }, [quantity, marketPrice, commissionType, commissionAmount, isOptionTrade, currentLimitPrice, orderType]);
  const estimatedCost = useMemo(() => {
      const priceToUse = orderType === 'limit' ? currentLimitPrice : marketPrice;
      
      // For mutual fund even-dollar transactions, use dollarAmount instead of calculated quantity
      if (isMutualFund && transactionType === 'even-dollar') {
        const baseCost = tradeMode === 'buy' ? dollarAmount : dollarAmount;
        return tradeMode === 'buy' ? baseCost + commission : baseCost - commission;
      }
      
      // For all other cases, use the standard calculation
      const baseCost = isOptionTrade ? quantity * currentLimitPrice * 100 : quantity * priceToUse;
      return tradeMode === 'buy' ? baseCost + commission : baseCost - commission;
  }, [quantity, marketPrice, commission, tradeMode, isOptionTrade, currentLimitPrice, orderType, isMutualFund, transactionType, dollarAmount]);

  // Calculate maximum quantity based on buying power
  const maxQuantity = useMemo(() => {
    if (!buyingPower || tradeMode !== 'buy') return Infinity;
    const priceToUse = orderType === 'limit' ? currentLimitPrice : marketPrice;
    if (!priceToUse) return Infinity;
    
    // Calculate how many shares can be bought with buying power
    const maxShares = Math.floor(buyingPower / priceToUse);
    return Math.max(0, maxShares);
  }, [buyingPower, tradeMode, orderType, currentLimitPrice, marketPrice]);

  // Helper function to get the correct action text for options
  const getOptionActionText = () => {
    if (!isOptionTrade) return '';
    
    // For close actions (when skipSegmentedControl is true), check optionSellType first
    if (skipSegmentedControl) {
      if (optionSellType === 'buyToClose') {
        return 'Buy to Close';
      } else if (optionSellType === 'sellToClose') {
        return 'Sell to Close';
      } else if (optionSellType === 'sellNaked') {
        return 'Sell Naked';
      }
    }
    
    // For regular open actions, check selectedOptionAction first
    if (selectedOptionAction === 'buyToOpen') {
      return 'Buy to Open';
    } else if (selectedOptionAction === 'sellToOpen') {
      return 'Sell to Open';
    }
    
    // Fallback to optionSellType for close actions when not in skipSegmentedControl mode
    if (optionSellType === 'buyToClose') {
      return 'Buy to Close';
    } else if (optionSellType === 'sellToClose') {
      return 'Sell to Close';
    } else if (optionSellType === 'sellNaked') {
      return 'Sell Naked';
    }
    
    // Final fallback based on trade mode
    if (tradeMode === 'buy') {
      return 'Buy to Open';
    } else if (tradeMode === 'sell') {
      return 'Sell to Open';
    }
    
    return '';
  };

  // --- Effects ---
  useEffect(() => {
    setOrderState('entry');
    setQuantity(0);
    setNotes('');
    setOrderType('market');
    setCurrentLimitPrice(limitPrice || marketPrice || 0);
    setCommissionType('regular');
    setSettlementType('regular');
    setTimeInForce('day');
    setTtoRep('');
    setSellerCode('Long-Stock');
    setGoodTillDate('');
    setSolicited('-');
    setDiscretion(false);
    setIsAdvancedOpen(false);
    setIsReviewAdvancedOpen(false);
    setTradeMode(initialTradeMode);
    setTransactionType('shares');
    setDollarAmount(0);
    
    // Reset special instructions
    setAllOrNone(false);
    setNotHeld(false);
    setDoNotIncrease(false);
    setDoNotReduce(false);
    setTimeWeightedAveragePrice(false);
    setVolumeWeightedAveragePrice(false);
    // Only reset optionSellType if not in a close action scenario
    // For close actions (skipSegmentedControl = true), optionSellType is set by the skipSegmentedControl useEffect
    if (!skipSegmentedControl) {
      setOptionSellType('sellToClose');
    } 
  }, [symbol, accountId, initialTradeMode, strikePrice, optionType, limitPrice, isOptionTrade, marketPrice]);

  useEffect(() => {
    if (orderState === 'review' && notesTextareaRef.current) {
      notesTextareaRef.current.focus();
    }
  }, [orderState]);

  // --- Validation ---
  const validationErrors = useMemo(() => {
    if (!showValidation) return [];
    
    const errors: string[] = [];
    
    // For mutual fund even-dollar transactions, validate dollar amount instead of quantity
    if (isMutualFund && transactionType === 'even-dollar') {
      if (dollarAmount <= 0) {
        errors.push('Dollar amount must be greater than 0');
      }
    } else {
      if (quantity <= 0) {
        errors.push('Quantity must be greater than 0');
      }
    }
    
    if (tradeMode === 'sell' && quantity > availableQuantity) {
      errors.push(`Cannot sell more than ${availableQuantity} shares (you own ${availableQuantity})`);
    }
    
    if (tradeMode === 'buy' && estimatedCost > buyingPower) {
      errors.push(`Insufficient buying power. Need $${estimatedCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, have $${buyingPower.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    }
    
    if (tradeMode === 'buy' && quantity > maxQuantity) {
      errors.push(`Cannot buy more than ${maxQuantity} shares with current buying power`);
    }
    
    return errors;
  }, [showValidation, quantity, tradeMode, availableQuantity, estimatedCost, buyingPower, maxQuantity, isMutualFund, transactionType, dollarAmount]);

  const canSubmit = validationErrors.length === 0 && (
    (isMutualFund && transactionType === 'even-dollar' && dollarAmount > 0) || 
    (!isMutualFund || transactionType === 'shares') && quantity > 0
  );

  // --- Trading Functions ---
  const executeTradeOrder = async () => {
    if (!canSubmit || !symbol) return;

    try {
      const priceToUse = orderType === 'limit' ? currentLimitPrice : marketPrice;
      const tradeValue = quantity * priceToUse;
      
      if (tradeMode === 'buy') {
        // Add or update holding
        if (currentHolding) {
          // Update existing holding
          const newQuantity = currentHolding.quantity + quantity;
          const newAvgPrice = ((currentHolding.quantity * currentHolding.avgPrice) + (quantity * priceToUse)) / newQuantity;
          
          await executeTrade({
            symbol: symbol.toUpperCase(),
            action: 'BUY',
            quantity: quantity,
            price: priceToUse,
            totalValue: tradeValue,
            commission: commission,
            holdingUpdates: {
              quantity: newQuantity,
              avgPrice: newAvgPrice
            },
            balanceUpdates: {
              cash: availableCash - tradeValue - commission
            }
          });
        } else {
          // Add new holding
          await addHolding({
            symbol: symbol.toUpperCase(),
            quantity: quantity,
            avgPrice: priceToUse,
            lastUpdated: new Date().toISOString()
          });
          
          // Update cash balance separately for new holdings
          await updateBalances({
            cash: availableCash - tradeValue - commission
          });
          
          // Add trade record separately for new holdings
          await addTrade({
            symbol: symbol.toUpperCase(),
            cusip: symbol.toUpperCase(),
            description: `${symbol.toUpperCase()} Stock`,
            action: 'BUY',
            quantity: quantity,
            price: priceToUse,
            totalValue: tradeValue,
            commission: commission,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().split(' ')[0],
            longShort: 'Long'
          });
        }
      } else if (tradeMode === 'sell') {
        // For options trades, we don't have holdings, so just add the trade record
        if (isOptionTrade) {
          await addTrade({
            symbol: symbol.toUpperCase(),
            cusip: symbol.toUpperCase(),
            description: `${symbol.toUpperCase()} ${strikePrice?.toFixed(2)} ${optionType?.toUpperCase()} Option`,
            action: 'SELL',
            quantity: quantity,
            price: priceToUse,
            totalValue: tradeValue,
            commission: commission,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().split(' ')[0],
            longShort: 'Long'
          });
        } else {
          // For stock trades, handle holdings
          if (!currentHolding) {
            console.error('Cannot sell: No holding found for', symbol);
            return;
          }
          
          console.log('🔄 Executing SELL trade:', {
            symbol: symbol.toUpperCase(),
            currentQuantity: currentHolding.quantity,
            sellQuantity: quantity,
            newQuantity: currentHolding.quantity - quantity
          });
          
          // Update holding (reduce quantity)
          const newQuantity = currentHolding.quantity - quantity;
        
          if (newQuantity <= 0) {
            console.log('🗑️ Removing holding completely');
            // Remove holding completely
            await removeHolding(symbol.toUpperCase());
            
            // Update cash balance and add trade record separately
            await updateBalances({
              cash: availableCash + tradeValue - commission
            });
            
            await addTrade({
              symbol: symbol.toUpperCase(),
              cusip: symbol.toUpperCase(),
              description: `${symbol.toUpperCase()} Stock`,
              action: 'SELL',
              quantity: quantity,
              price: priceToUse,
              totalValue: tradeValue,
              commission: commission,
              date: new Date().toISOString().split('T')[0],
              time: new Date().toTimeString().split(' ')[0],
              longShort: 'Long'
            });
          } else {
            // Update quantity using combined function
            await executeTrade({
              symbol: symbol.toUpperCase(),
              action: 'SELL',
              quantity: quantity,
              price: priceToUse,
              totalValue: tradeValue,
              commission: commission,
              holdingUpdates: {
                quantity: newQuantity
              },
              balanceUpdates: {
                cash: availableCash + tradeValue - commission
              }
            });
          }
        }
      }
      
      console.log('Trade executed successfully');
      
      // Set order status based on order type
      // Market orders are filled immediately, others are pending
      const isMarketOrder = orderType === 'market';
      setOrderStatus(isMarketOrder ? 'filled' : 'pending');
      
      setOrderState('confirmation');
    } catch (error) {
      console.error('Error executing trade:', error);
      // Handle error - maybe show a toast or error message
    }
  };

  // --- Handlers ---
  const handleReviewOrder = () => {
    setShowValidation(true);
    if (canSubmit) {
      setOrderState('review');
    }
  };
  
  const handleConfirmOrder = () => {
    executeTradeOrder();
  };
  const handleBackToEntry = () => {
    setOrderState('entry');
    setShowValidation(false);
  };
  const handleNewOrder = () => {
    setOrderState('entry');
    setQuantity(0);
    setNotes('');
    setTradeMode(initialTradeMode);
    setTransactionType('shares');
    setDollarAmount(0);
  };
  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => {
      const newQuantity = Math.max(0, prev + amount);
      // Enforce limits based on trade mode
      const maxAllowed = tradeMode === 'buy' ? maxQuantity : availableQuantity;
      return Math.min(newQuantity, maxAllowed);
    });
    setShowValidation(false);
  };

  const handleAccountSelect = (newAccountId: string) => {
    setIsAccountModalOpen(false);
    // Always navigate to the new account URL to preserve trade mode
    router.push(`/account/${newAccountId}/trade/${symbol}?mode=${tradeMode}`);
  };

  // --- Render Helper Function for Form Rows ---
  const renderFormRow = (label: string, children: React.ReactNode) => (
    <div className="flex items-center justify-between py-1 text-sm">
      <label className="text-muted-foreground whitespace-nowrap mr-4">{label}</label>
      <div className="flex-grow flex justify-end text-right">{children}</div>
    </div>
  );


  // --- Main Render Functions ---
  const renderOrderEntry = () => {
    if (!initialTradeMode) {
      return null;
    }
    
    return (
      <div>
        {/* Trade execution form */}
        {initialTradeMode && (
          <div className="text-left pb-3 mb-3">
            <h3 className="text-xl font-medium">
                {isOptionTrade ? (
                  `${symbol?.toUpperCase()} $${strikePrice?.toFixed(2) || '0.00'} ${optionType?.toUpperCase()} - 8/22/2025`
                ) : (
                  `${tradeMode?.charAt(0).toUpperCase()}${tradeMode?.slice(1)} ${symbol?.toUpperCase()}`
                )}
            </h3>
            
            
            {/* Option Trade Type - Show segmented control only when NOT skipping */}
            {isOptionTrade && skipSegmentedControl && (
              <div className="mt-3 text-left">
                <div className={`text-sm font-normal px-3 py-2 rounded-md flex items-center gap-2 ${
                  tradeMode === 'buy' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                }`}>
                  <CheckCircle className="w-4 h-4" />
                  {tradeMode === 'buy' ? 'Buy to Close' : 'Sell to Close'}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {tradeMode === 'buy' 
                    ? 'Buy back an option you previously sold.' 
                    : 'Sell an option you previously bought.'
                  }
                </div>
              </div>
            )}
            {isOptionTrade && !skipSegmentedControl && (
              <div className="mt-3">
                <div className="flex bg-accent rounded-md p-1">
                  <button
                    onClick={() => {
                      setSelectedOptionAction('buyToOpen');
                      setOptionSellType('buyToClose'); // Set appropriate close action
                    }}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      selectedOptionAction === 'buyToOpen'
                        ? 'bg-lime-500 hover:bg-lime-600 dark:bg-lime-800 dark:hover:bg-lime-700 dark:border dark:border-lime-200 text-white dark:text-white font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Buy to Open
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOptionAction('sellToOpen');
                      setOptionSellType('sellToClose'); // Set appropriate close action
                    }}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      selectedOptionAction === 'sellToOpen'
                        ? 'bg-red-600 hover:bg-red-600 dark:bg-red-900 dark:hover:bg-red-700 dark:border dark:border-red-400 text-white dark:text-white font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Sell to Open
                  </button>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {selectedOptionAction === 'buyToOpen' && 'Buy an option contract to open a new position.'}
                  {selectedOptionAction === 'sellToOpen' && 'Sell (write) an option contract to open a new position.'}
                </div>
              </div>
            )}
          </div>
       )}

       <div className="py-1 text-sm">
         <label className="text-muted-foreground text-sm font-medium block mb-1">Trading for</label>
         <Button
           variant="outline" 
           onClick={() => setIsAccountModalOpen(true)} 
           className="w-full h-auto px-3 py-3 flex items-center justify-between text-left"
         >
           <div className="flex flex-col items-start">
             <span className="font-medium text-sm">
               {accountId} - <span className="text-foreground">{formatAccountType(accountDetails.type)}</span>
             </span>
             <span className="text-xs text-muted-foreground mt-1">
               {accountDetails.clientName}
             </span>
           </div>
           <ChevronDown className="h-4 w-4 text-muted-foreground" />
         </Button>
       </div>
       {renderFormRow('Account Type', (
         <Select value={accountType} onValueChange={(v) => setAccountType(v as 'Cash' | 'Margin')} >
            <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Margin">Margin</SelectItem>
            </SelectContent>
         </Select>
       ))}

       {isMutualFund && (
         renderFormRow('Action', (
           <Select value={tradeMode || ''} onValueChange={(v) => setTradeMode(v as TradeMode)}>
             <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue /></SelectTrigger>
             <SelectContent>
               <SelectItem value="buy">Buy</SelectItem>
               <SelectItem value="sell">Sell</SelectItem>
               <SelectItem value="full-liquidation">Full Liquidation</SelectItem>
               <SelectItem value="full-exchange">Full Exchange</SelectItem>
               <SelectItem value="partial-exchange">Partial Exchange</SelectItem>
             </SelectContent>
           </Select>
         ))
       )}

       {isMutualFund && (
         renderFormRow('Transaction Type', (
           <Select value={transactionType} onValueChange={(value) => setTransactionType(value as 'even-dollar' | 'shares')}>
             <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue /></SelectTrigger>
             <SelectContent>
               <SelectItem value="even-dollar">Even Dollar</SelectItem>
               <SelectItem value="shares">Shares</SelectItem>
             </SelectContent>
           </Select>
         ))
       )}

       {isMutualFund && transactionType === 'even-dollar' && (
         renderFormRow('Dollar Amount', (
           <div className="relative flex items-center">
             <span className="absolute left-2 text-xs text-muted-foreground">$</span>
             <Input
               type="number"
               value={dollarAmount || ''}
               onChange={(e) => setDollarAmount(Number(e.target.value))}
               placeholder="0"
               step="1"
               min="0"
               className="w-[140px] h-8 text-xs text-right pl-6 pr-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
             />
           </div>
         ))
       )}


       {!initialTradeMode && !isOptionTrade && (
         <div className="grid grid-cols-2 gap-2 pt-2 border-t">
           <Button variant={tradeMode === 'buy' ? 'default' : 'outline'} onClick={() => setTradeMode('buy')} className={cn("w-full font-semibold", tradeMode === 'buy' && "bg-green-600 hover:bg-green-700 text-white dark:text-white")} >Buy</Button>
           <Button variant={tradeMode === 'sell' ? 'default' : 'outline'} onClick={() => setTradeMode('sell')} className={cn("w-full font-semibold", tradeMode === 'sell' && "bg-red-600 hover:bg-red-700 text-white dark:text-white")} >Sell</Button>
         </div>
       )}

       {tradeMode && (
         <div className="space-y-1">

           {!isMutualFund && (
             renderFormRow('Order Type', (
               <Select value={orderType} onValueChange={(v) => setOrderType(v as OrderType)}>
                 <SelectTrigger><SelectValue /></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="market">Market</SelectItem>
                   <SelectItem value="limit">Limit</SelectItem>
                   {!isOptionTrade && <SelectItem value="stop">Stop</SelectItem>}
                   {!isOptionTrade && <SelectItem value="stop-limit">Stop-Limit</SelectItem>}
                 </SelectContent>
               </Select>
             ))
           )}
           {isOptionTrade && orderType === 'market' && (
             <div className="flex items-center justify-between py-2 text-sm">
               <div className="flex items-center gap-1">
                 <label className="text-muted-foreground whitespace-nowrap">Price</label>
                 <OptionsMarketDataOverlay
                   bid={5.10}
                   bidContracts={20}
                   ask={5.20}
                   askContracts={15}
                   last={5.15}
                   lastContracts={10}
                   exchange="CBOE"
                   lastTime="10:36:05 ET"
                   underlyingLast={234.35}
                 />
               </div>
               <div className="flex-grow flex justify-end text-right">
                 <span className="font-medium">${marketPrice.toFixed(2)}</span>
               </div>
             </div>
           )}
           {orderType === 'limit' && (
             <div className="flex items-center justify-between py-2 text-sm">
               <div className="flex items-center gap-1">
                 <label className="text-muted-foreground whitespace-nowrap">Limit Price</label>
                 {isOptionTrade && (
                   <OptionsMarketDataOverlay
                     bid={5.10}
                     bidContracts={20}
                     ask={5.20}
                     askContracts={15}
                     last={5.15}
                     lastContracts={10}
                     exchange="CBOE"
                     lastTime="10:36:05 ET"
                     underlyingLast={234.35}
                   />
                 )}
               </div>
               <div className="flex-grow flex justify-end text-right">
                 <div className="relative flex items-center max-w-[120px]">
                    <Input 
                      type="number" 
                      value={currentLimitPrice || ''} 
                      onChange={(e) => setCurrentLimitPrice(parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0)}
                      placeholder="0.00" 
                      min="0" 
                      step="0.01"
                      className="text-right pr-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                 </div>
               </div>
             </div>
           )}
           {orderType === 'stop' && renderFormRow('Stop Price', (
              <div className="relative flex items-center max-w-[120px]">
                 <Input 
                   type="number" 
                   value={stopPrice || ''} 
                   onChange={(e) => setStopPrice(parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0)}
                   placeholder="0.00" 
                   min="0" 
                   step="0.01"
                   className="text-right pr-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                 />
              </div>
           ))}
           {orderType === 'stop-limit' && (
             <>
               {renderFormRow('Stop Price', (
                  <div className="relative flex items-center max-w-[120px]">
                     <Input 
                       type="number" 
                       value={stopPrice || ''} 
                       onChange={(e) => setStopPrice(parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0)}
                       placeholder="0.00" 
                       min="0" 
                       step="0.01"
                       className="text-right pr-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                     />
                  </div>
               ))}
               {renderFormRow('Limit Price', (
                  <div className="relative flex items-center max-w-[120px]">
                     <Input 
                       type="number" 
                       value={stopLimitPrice || ''} 
                       onChange={(e) => setStopLimitPrice(parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0)}
                       placeholder="0.00" 
                       min="0" 
                       step="0.01"
                       className="text-right pr-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                     />
                  </div>
               ))}
             </>
           )}
           {orderType === 'market' && !isOptionTrade && (
             <div className="flex items-center justify-between py-2 text-sm">
               <div className="flex items-center gap-1">
                 <label className="text-muted-foreground whitespace-nowrap">{isMutualFund ? 'NAV' : 'Market Price'}</label>
                 {isMutualFund ? (
                   <MutualFundMarketDataOverlay
                     symbol="VTSAX"
                     name="Vanguard Total Stock Market Index Fund Admiral Shares"
                     nav={158.11}
                     change={0.85}
                     changePercent={0.54}
                     previousClose={157.26}
                     dayHigh={158.15}
                     dayLow={157.20}
                     yearHigh={165.40}
                     yearLow={145.20}
                     expenseRatio={0.0003}
                     netAssets={2850000000000}
                     timestamp="4:00:21 PM ET, 03/10/2025"
                   />
                 ) : (
                   <MarketDataOverlay
                     currentPrice={234.35}
                     change={-2.15}
                     changePercent={-0.91}
                     bid={234.33}
                     ask={234.37}
                     lastSize={200}
                     bidSize={500}
                     askSize={300}
                     exchange="XNAS"
                     timestamp="03:55:49 PM ET, 03/10/2025"
                   />
                 )}
               </div>
               <div className="flex-grow flex justify-end text-right">
                 <span className="font-medium">${marketPrice.toFixed(2)}</span>
               </div>
             </div>
           )}
           <div className="py-1 text-sm">
             <div className="flex items-center justify-between">
               <label className="text-muted-foreground whitespace-nowrap mr-4">{isOptionTrade ? 'Contracts' : 'Quantity'}</label>
               <div className="relative flex items-center max-w-[120px]">
                  {isMutualFund && transactionType === 'even-dollar' ? (
                    // Read-only quantity for even dollar mutual fund transactions
                    <Input 
                      type="number" 
                      value={dollarAmount > 0 ? (dollarAmount / marketPrice).toFixed(4) : '0'} 
                      readOnly
                      placeholder="0" 
                      className="text-right pr-7 bg-muted [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  ) : (
                    // Editable quantity for all other cases
                    <>
                      <Input 
                        type="number" 
                        value={quantity || ''} 
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0;
                          // Enforce limits based on trade mode
                          const maxAllowed = tradeMode === 'buy' ? maxQuantity : availableQuantity;
                          const limitedQuantity = Math.min(newQuantity, maxAllowed);
                          setQuantity(limitedQuantity);
                          setShowValidation(false);
                        }}
                        placeholder="0" 
                        min="0" 
                        max={tradeMode === 'buy' ? maxQuantity : availableQuantity}
                        className="text-right pr-7 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex flex-col h-full justify-center">
                         <Button variant="ghost" size="icon" className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground" onClick={() => handleQuantityChange(1)} aria-label="Increase quantity">
                            <ChevronUp className="h-3 w-3" />
                         </Button>
                         <Button variant="ghost" size="icon" className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground" onClick={() => handleQuantityChange(-1)} aria-label="Decrease quantity" disabled={quantity <= 0}>
                            <ChevronDown className="h-3 w-3" />
                         </Button>
                      </div>
                    </>
                  )}
               </div>
             </div>
             
             {/* Account holdings info - positioned below Quantity label on the left, only show for sell orders */}
             {tradeMode === 'sell' && availableQuantity > 0 && !isOptionTrade && (
               <div className="text-xs text-muted-foreground mt-0.5">
                 <span className="text-muted-foreground">
                   Holding {availableQuantity} {symbol?.toUpperCase()}
                 </span>
               </div>
             )}
             
             {/* Validation errors */}
             {validationErrors.length > 0 && (
               <div className="text-xs text-red-500 space-y-1 mt-1">
                 {validationErrors.map((error, index) => (
                   <div key={index}>{error}</div>
                 ))}
               </div>
             )}
           </div>
           {renderFormRow('Commission', (
             <div className="flex items-center gap-2 justify-end">
               <Select value={commissionType} onValueChange={(v) => setCommissionType(v as CommissionType)}>
                 <SelectTrigger className="w-[140px] h-8 text-xs">
                    <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="regular">Regular</SelectItem>
                   <SelectItem value="flatRate">Flat Rate</SelectItem>
                   <SelectItem value="centsPerShare">Cents per Share</SelectItem>
                   <SelectItem value="percentDiscount">Percent Discount</SelectItem>
                 </SelectContent>
               </Select>
               {commissionType === 'flatRate' && (
                 <div className="flex items-center gap-1">
                   <span className="text-xs text-muted-foreground">$</span>
                   <Input 
                     type="number" 
                     value={commissionAmount || ''} 
                     onChange={(e) => setCommissionAmount(parseFloat(e.target.value) || 0)}
                     placeholder="0.00" 
                     min="0" 
                     step="0.01"
                     className="w-[80px] h-8 text-xs text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                   />
                 </div>
               )}
               {commissionType === 'centsPerShare' && (
                 <div className="flex items-center gap-1">
                   <span className="text-xs text-muted-foreground">$</span>
                   <Input 
                     type="number" 
                     value={commissionAmount || ''} 
                     onChange={(e) => setCommissionAmount(parseFloat(e.target.value) || 0)}
                     placeholder="0.00" 
                     min="0.01" 
                     max="99.99"
                     step="0.01"
                     className="w-[80px] h-8 text-xs text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                   />
                 </div>
               )}
               {commissionType === 'percentDiscount' && (
                 <div className="flex items-center gap-1">
                   <Input 
                     type="number" 
                     value={commissionAmount || ''} 
                     onChange={(e) => setCommissionAmount(parseFloat(e.target.value) || 0)}
                     placeholder="0.00" 
                     min="0.01" 
                     max="5.00"
                     step="0.01"
                     className="w-[80px] h-8 text-xs text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                   />
                   <span className="text-xs text-muted-foreground">%</span>
                 </div>
               )}
               {quantity > 0 && commissionType === 'regular' && (
                 <span className="font-medium w-[50px] text-right">${commission.toFixed(2)}</span>
               )}
             </div>
           ))}

           {/* Tax Allocation Methodology - Only show for stock sells with Cash or Margin accounts */}
           {!isOptionTrade && tradeMode === 'sell' && (accountType === 'Cash' || accountType === 'Margin') && (
             <div className="py-2">
               <label className="text-muted-foreground text-sm font-medium block mb-2">Tax Allocation Methodology</label>
               <Select value={taxAllocationMethod} onValueChange={(v) => setTaxAllocationMethod(v as TaxAllocationMethod)}>
                 <SelectTrigger className="w-full h-8 text-xs">
                    <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="FirstInFirstOut">First In First Out</SelectItem>
                   <SelectItem value="LastInFirstOut">Last In First Out</SelectItem>
                   <SelectItem value="LowestCostFirstOut">Lowest Cost First Out</SelectItem>
                   <SelectItem value="HighestCost">Highest Cost</SelectItem>
                   <SelectItem value="LowestCostShortTerm">Lowest Cost Short Term</SelectItem>
                   <SelectItem value="LowestCostLongTerm">Lowest Cost Long Term</SelectItem>
                   <SelectItem value="HighestCostShortTerm">Highest Cost Short Term</SelectItem>
                   <SelectItem value="HighestCostLongTerm">Highest Cost Long Term</SelectItem>
                   <SelectItem value="MinimizeTaxImplications">Minimize Tax Implications</SelectItem>
                   <SelectItem value="MaximumGain">Maximum Gain</SelectItem>
                 </SelectContent>
               </Select>
             </div>
           )}

           {/* Settlement Type - ACAPS specific - Only for equities */}
           {!isOptionTrade && renderFormRow('Settlement Type', (
             <Select value={settlementType} onValueChange={(v) => setSettlementType(v)}>
               <SelectTrigger className="w-[120px] h-8 text-xs">
                  <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="regular">Regular</SelectItem>
                 <SelectItem value="sameDay">Same Day</SelectItem>
               </SelectContent>
             </Select>
           ))}

           {/* Mutual Fund specific non-advanced settings */}
           {isMutualFund && (
             <>
               {renderFormRow('Customer Status', (
                 <Select value={customerStatus} onValueChange={setCustomerStatus}>
                   <SelectTrigger className="w-[140px] h-8 text-xs">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="-">-</SelectItem>
                     <SelectItem value="Existing">Existing</SelectItem>
                     <SelectItem value="New">New</SelectItem>
                   </SelectContent>
                 </Select>
               ))}
               {renderFormRow('Reinvest Divs', (
                 <Select value={shareProcessing} onValueChange={setShareProcessing}>
                   <SelectTrigger className="w-[140px] h-8 text-xs">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="-">-</SelectItem>
                     <SelectItem value="Regular">Regular</SelectItem>
                     <SelectItem value="Pay in Cash">Pay in Cash</SelectItem>
                     <SelectItem value="Reinvest">Reinvest</SelectItem>
                   </SelectContent>
                 </Select>
               ))}
               {renderFormRow('Distribution Long Gains', (
                 <Select value={distributionLongGains} onValueChange={setDistributionLongGains}>
                   <SelectTrigger className="w-[140px] h-8 text-xs">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="-">-</SelectItem>
                     <SelectItem value="Day">Day</SelectItem>
                     <SelectItem value="Pay in Cash">Pay in Cash</SelectItem>
                     <SelectItem value="Reinvest">Reinvest</SelectItem>
                   </SelectContent>
                 </Select>
               ))}
               {renderFormRow('Distribution Short Gains', (
                 <Select value={distributionShortGains} onValueChange={setDistributionShortGains}>
                   <SelectTrigger className="w-[140px] h-8 text-xs">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="-">-</SelectItem>
                     <SelectItem value="Day">Day</SelectItem>
                     <SelectItem value="Pay in Cash">Pay in Cash</SelectItem>
                     <SelectItem value="Reinvest">Reinvest</SelectItem>
                   </SelectContent>
                 </Select>
               ))}
               {renderFormRow('Network', (
                 <div className="flex gap-4">
                   <label className="flex items-center gap-2">
                     <input 
                       type="radio" 
                       name="network" 
                       value="yes" 
                       checked={network} 
                       onChange={(e) => setNetwork(e.target.value === 'yes')}
                       className="form-radio"
                     />
                     <span className="text-sm">Yes</span>
                   </label>
                   <label className="flex items-center gap-2">
                     <input 
                       type="radio" 
                       name="network" 
                       value="no" 
                       checked={!network} 
                       onChange={(e) => setNetwork(e.target.value === 'yes')}
                       className="form-radio"
                     />
                     <span className="text-sm">No</span>
                   </label>
                 </div>
               ))}
               {renderFormRow('Solicited', (
                 <Select value={solicited} onValueChange={setSolicited}>
                   <SelectTrigger className="w-[140px] h-8 text-xs">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="-">-</SelectItem>
                     <SelectItem value="Yes">Yes</SelectItem>
                     <SelectItem value="No">No</SelectItem>
                   </SelectContent>
                 </Select>
               ))}
             </>
           )}

           <details className="pt-2 group" open={isAdvancedOpen} onToggle={(e) => setIsAdvancedOpen(e.currentTarget.open)}>
             <summary className="list-none flex items-center justify-center text-sm text-primary hover:underline cursor-pointer py-2">
               {isAdvancedOpen ? 'Hide' : 'Show'} Advanced Options
               <ChevronDown className={cn("w-4 h-4 ml-1 transition-transform", isAdvancedOpen && "rotate-180")} />
             </summary>
             <div className="mt-2 rounded-md bg-background/50 space-y-2">
               {/* Mutual Fund specific advanced options */}
               {isMutualFund ? (
                 <div className="space-y-4">
                   {/* Tab Navigation */}
                   <div className="flex border-b border-gray-200 dark:border-gray-700">
                     <button
                       onClick={() => setMutualFundTab('exchange')}
                       className={cn(
                         "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                         mutualFundTab === 'exchange'
                           ? "border-primary text-primary"
                           : "border-transparent text-gray-500 hover:text-gray-700"
                       )}
                     >
                       Exchange for
                     </button>
                     <button
                       onClick={() => setMutualFundTab('optional')}
                       className={cn(
                         "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                         mutualFundTab === 'optional'
                           ? "border-primary text-primary"
                           : "border-transparent text-gray-500 hover:text-gray-700"
                       )}
                     >
                       Optional settings
                     </button>
                   </div>

                   {/* Exchange for Tab */}
                   {mutualFundTab === 'exchange' && (
                     <div className="space-y-2 p-2">
                       {renderFormRow('Customer status', (
                         <Select value={customerStatus} onValueChange={setCustomerStatus}>
                           <SelectTrigger className="w-[140px] h-8 text-xs">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="-">-</SelectItem>
                             <SelectItem value="Existing">Existing</SelectItem>
                             <SelectItem value="New">New</SelectItem>
                           </SelectContent>
                         </Select>
                       ))}
                       {renderFormRow('Share Processing', (
                         <Select value={shareProcessing} onValueChange={setShareProcessing}>
                           <SelectTrigger className="w-[140px] h-8 text-xs">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="Regular">Regular</SelectItem>
                             <SelectItem value="Same Day">Same Day</SelectItem>
                             <SelectItem value="Next Day">Next Day</SelectItem>
                           </SelectContent>
                         </Select>
                       ))}
                     </div>
                   )}

                   {/* Optional settings Tab */}
                   {mutualFundTab === 'optional' && (
                     <div className="space-y-2 p-2">
                       {renderFormRow('NAV', (
                         <Select value={nav} onValueChange={setNav}>
                           <SelectTrigger className="w-[140px] h-8 text-xs">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="-">-</SelectItem>
                             <SelectItem value="Current NAV">Current NAV</SelectItem>
                             <SelectItem value="Next NAV">Next NAV</SelectItem>
                           </SelectContent>
                         </Select>
                       ))}
                       {renderFormRow('Discretion', (
                         <Select value={mutualFundDiscretion} onValueChange={setMutualFundDiscretion}>
                           <SelectTrigger className="w-[140px] h-8 text-xs">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="-">-</SelectItem>
                             <SelectItem value="Yes">Yes</SelectItem>
                             <SelectItem value="No">No</SelectItem>
                           </SelectContent>
                         </Select>
                       ))}
                       {renderFormRow('No CDSC', (
                         <Select value={noCdsc} onValueChange={setNoCdsc}>
                           <SelectTrigger className="w-[140px] h-8 text-xs">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="-">-</SelectItem>
                             <SelectItem value="Yes">Yes</SelectItem>
                             <SelectItem value="No">No</SelectItem>
                           </SelectContent>
                         </Select>
                       ))}
                       {renderFormRow('LOI/ROA Breakpoint', (
                         <Select value={loiRoaBreakpoint} onValueChange={setLoiRoaBreakpoint}>
                           <SelectTrigger className="w-[140px] h-8 text-xs">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="-">-</SelectItem>
                             <SelectItem value="Yes">Yes</SelectItem>
                             <SelectItem value="No">No</SelectItem>
                           </SelectContent>
                         </Select>
                       ))}
                       {renderFormRow('Related Account Type', (
                         <Select value={relatedAccountType} onValueChange={setRelatedAccountType}>
                           <SelectTrigger className="w-[140px] h-8 text-xs">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="-">-</SelectItem>
                             <SelectItem value="Individual">Individual</SelectItem>
                             <SelectItem value="Joint">Joint</SelectItem>
                             <SelectItem value="IRA">IRA</SelectItem>
                           </SelectContent>
                         </Select>
                       ))}
                       {renderFormRow('TTO Rep', (
                         <Input
                           value={ttoRep}
                           onChange={(e) => setTtoRep(e.target.value)}
                           placeholder="Type code"
                           className="w-[140px] h-8 text-xs"
                         />
                       ))}
                     </div>
                   )}
                 </div>
               ) : (
                 <>
                   {/* Special Instructions - Only available for non-Market Orders and non-option trades */}
                   {orderType !== 'market' && !isOptionTrade && (
                 <div className="space-y-2">
                   <div className="text-sm font-medium text-muted-foreground">Special Instructions</div>
                   <div className="space-y-2 pl-2">
                     {/* All or None - Available for all non-Market Orders */}
                     <label className="flex items-center gap-2 cursor-pointer">
                       <input 
                         type="checkbox" 
                         checked={allOrNone} 
                         onChange={(e) => setAllOrNone(e.target.checked)} 
                         className="form-checkbox"
                       />
                       <span className="text-sm">All or None</span>
                     </label>
                     
                     {/* Not Held - Available for all non-Market Orders */}
                     <label className="flex items-center gap-2 cursor-pointer">
                       <input 
                         type="checkbox" 
                         checked={notHeld} 
                         onChange={(e) => setNotHeld(e.target.checked)} 
                         className="form-checkbox"
                       />
                       <span className="text-sm">Not Held</span>
                     </label>
                     
                     {/* Do not Increase - Only available for Day Orders */}
                     {timeInForce === 'day' && (
                       <label className="flex items-center gap-2 cursor-pointer">
                         <input 
                           type="checkbox" 
                           checked={doNotIncrease} 
                           onChange={(e) => setDoNotIncrease(e.target.checked)} 
                           className="form-checkbox"
                         />
                         <span className="text-sm">Do not Increase</span>
                       </label>
                     )}
                     
                     {/* Do not Reduce - Only available for Day Orders */}
                     {timeInForce === 'day' && (
                       <label className="flex items-center gap-2 cursor-pointer">
                         <input 
                           type="checkbox" 
                           checked={doNotReduce} 
                           onChange={(e) => setDoNotReduce(e.target.checked)} 
                           className="form-checkbox"
                         />
                         <span className="text-sm">Do not Reduce</span>
                       </label>
                     )}
                     
                     {/* Time Weighted Average Price - Only available for Day Orders, not for Stop/Stop Limit */}
                     {timeInForce === 'day' && orderType !== 'stop' && orderType !== 'stop-limit' && (
                       <label className="flex items-center gap-2 cursor-pointer">
                         <input 
                           type="checkbox" 
                           checked={timeWeightedAveragePrice} 
                           onChange={(e) => setTimeWeightedAveragePrice(e.target.checked)} 
                           className="form-checkbox"
                         />
                         <span className="text-sm">Time Weighted Average Price</span>
                       </label>
                     )}
                     
                     {/* Volume Weighted Average Price - Only available for Day Orders, not for Stop/Stop Limit */}
                     {timeInForce === 'day' && orderType !== 'stop' && orderType !== 'stop-limit' && (
                       <label className="flex items-center gap-2 cursor-pointer">
                         <input 
                           type="checkbox" 
                           checked={volumeWeightedAveragePrice} 
                           onChange={(e) => setVolumeWeightedAveragePrice(e.target.checked)} 
                           className="form-checkbox"
                         />
                         <span className="text-sm">Volume Weighted Average Price</span>
                       </label>
                     )}
                   </div>
                 </div>
               )}
                {renderFormRow('Time in Force', (
                 <Select value={timeInForce} onValueChange={(v) => setTimeInForce(v as TimeInForce)}>
                   <SelectTrigger><SelectValue /></SelectTrigger>
                   <SelectContent>
                     <SelectItem value="day">Day</SelectItem>
                     <SelectItem value="gtc">Good &apos;til Canceled (GTC)</SelectItem>
                     <SelectItem value="gtd">Good Till Date (GTD)</SelectItem>
                     {!(isOptionTrade && orderType === 'limit') && <SelectItem value="ioc">Immediate or Cancel (IOC)</SelectItem>}
                   </SelectContent>
                 </Select>
               ))}
               {timeInForce === 'gtd' && renderFormRow('Good Till Date', (
                 <Input 
                   type="date" 
                   value={goodTillDate} 
                   onChange={(e) => setGoodTillDate(e.target.value)}
                   className="w-[140px] h-8 text-xs"
                   min={new Date().toISOString().split('T')[0]}
                 />
               ))}
               {renderFormRow('TTO Rep', (
                 <Input 
                   type="text" value={ttoRep} 
                   onChange={(e) => setTtoRep(e.target.value)} 
                   placeholder="Rep code for commission credit" 
                   className="text-right text-xs" 
                 />
               ))}
               {/* Seller Code - Only for equities and only when selling */}
               {!isOptionTrade && tradeMode === 'sell' && renderFormRow('Seller Code', (
                 <Select value={sellerCode} onValueChange={setSellerCode}>
                   <SelectTrigger><SelectValue /></SelectTrigger>
                   <SelectContent>
                     <SelectItem value="Long-Stock">Long-Stock</SelectItem>
                     <SelectItem value="Long-Power">Long-Power</SelectItem>
                     <SelectItem value="Will Deliver">Will Deliver</SelectItem>
                     <SelectItem value="Instructions Sent">Instructions Sent</SelectItem>
                     <SelectItem value="Long Exchange">Long Exchange</SelectItem>
                   </SelectContent>
                 </Select>
               ))}
               {renderFormRow('Discretion', (
                 <div className="flex justify-end">
                   <Switch 
                     checked={discretion} 
                     onCheckedChange={setDiscretion}
                   />
                 </div>
               ))}
                 </>
               )}
             </div>
           </details>

           <div className="flex items-center justify-between text-sm font-medium border-t pt-3 mt-2">
             <span>Estimated {tradeMode === 'buy' ? 'Cost' : 'Proceeds'}</span>
             <span>${estimatedCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {isOptionTrade && <span className='text-xs text-muted-foreground'>({quantity} x ${currentLimitPrice.toFixed(2)} x 100)</span>}</span>
           </div>

           <div className="pt-4">
              <Button
                 onClick={handleReviewOrder}
                 disabled={!canSubmit}
                 className="w-full"
                 size="lg"
              >
                 Review Order
              </Button>
           </div>

           {/* Buying Power Display */}
           <div className="text-center text-xs text-muted-foreground pt-2">
             <div>Buying Power: ${buyingPower?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</div>
           </div>

           <div className="text-center text-xs text-muted-foreground pt-2">
             Market is currently open. Order will be placed immediately.
           </div>
         </div>
       )}
      </div>
    );
  };

 const renderOrderReview = () => (
     <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={handleBackToEntry} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <h3 className="text-2xl font-normal">Review Order</h3>
      </div>
       <div className=" text-sm rounded-md">
         {renderFormRow(isOptionTrade ? 'Contract' : 'Action', <span className="font-medium capitalize text-right">{isOptionTrade ? `${quantity}x ${symbol?.toUpperCase()} ${strikePrice?.toFixed(2)} ${optionType?.toUpperCase()} ${quantity === 1 ? 'Contract' : 'Contracts'}` : `${tradeMode} ${quantity} ${symbol?.toUpperCase()} ${quantity === 1 ? 'Share' : 'Shares'}`}</span>)}
         {isOptionTrade && renderFormRow('Action', <span className="font-medium text-right">{getOptionActionText()}</span>)}
         {renderFormRow('Account', <span className="font-medium text-right">{accountDetails.name} ({accountId})</span>)}
         {renderFormRow('Account Type', <span className="font-medium text-right">{accountType}</span>)}
         {!isMutualFund && renderFormRow('Order Type', <span className="font-medium capitalize text-right">{orderType === 'stop-limit' ? 'Stop-Limit' : orderType} Order</span>)}
         {orderType === 'limit' && renderFormRow('Limit Price', <span className="font-medium text-right">${currentLimitPrice.toFixed(2)}</span>)}
         {orderType === 'stop' && renderFormRow('Stop Price', <span className="font-medium text-right">${stopPrice.toFixed(2)}</span>)}
         {orderType === 'stop-limit' && (
           <>
             {renderFormRow('Stop Price', <span className="font-medium text-right">${stopPrice.toFixed(2)}</span>)}
             {renderFormRow('Limit Price', <span className="font-medium text-right">${stopLimitPrice.toFixed(2)}</span>)}
           </>
         )}
         {orderType === 'market' && !isOptionTrade && renderFormRow(isMutualFund ? 'NAV' : 'Market Price', <span className="font-medium text-right">~${marketPrice.toFixed(2)}</span>)}
         {renderFormRow('Commission Type', <span className="font-medium capitalize text-right">{commissionType}</span>)}
         {renderFormRow('Commission Est.', <span className="font-medium text-right">${commission.toFixed(2)}</span>)}
         {/* Show tax allocation method only for stock sells with Cash or Margin accounts */}
         {!isOptionTrade && tradeMode === 'sell' && (accountType === 'Cash' || accountType === 'Margin') && renderFormRow('Tax Allocation', <span className="font-medium text-right">{taxAllocationMethod.replace(/([A-Z])/g, ' $1').trim()}</span>)}

         <details className="pt-2 group" open={isReviewAdvancedOpen} onToggle={(e) => setIsReviewAdvancedOpen(e.currentTarget.open)}>
           <summary className="list-none flex items-center justify-center text-xs text-primary hover:underline cursor-pointer py-2">
              {isReviewAdvancedOpen ? 'Hide' : 'Show'} Advanced Details
              <ChevronDown className={cn("w-3 h-3 ml-1 transition-transform", isReviewAdvancedOpen && "rotate-180")} />
            </summary>
           <div className="mt-1 space-y-1">
              {renderFormRow('Time in Force', <span className="font-medium uppercase text-right">{timeInForce}</span>)}
              {timeInForce === 'gtd' && goodTillDate && renderFormRow('Good Till Date', <span className="font-medium text-right">{new Date(goodTillDate).toLocaleDateString()}</span>)}
              {!isOptionTrade && renderFormRow('Settlement Type', <span className="font-medium capitalize text-right">{settlementType}</span>)}
              {orderType !== 'market' && !isOptionTrade && (
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Special Instructions</span>
                  <div className="text-right">
                    {[allOrNone && 'All or None', notHeld && 'Not Held', doNotIncrease && 'Do not Increase', doNotReduce && 'Do not Reduce', timeWeightedAveragePrice && 'Time Weighted Average Price', volumeWeightedAveragePrice && 'Volume Weighted Average Price'].filter(Boolean).join(', ') || 'None'}
                  </div>
                </div>
              )}
              {!isOptionTrade && tradeMode === 'sell' && renderFormRow('Seller Code', <span className="font-medium text-right">{sellerCode}</span>)}
              {renderFormRow('Solicited', <span className="font-medium text-right">{solicited}</span>)}
              {renderFormRow('Discretion', <span className="font-medium text-right">{discretion ? 'Yes' : 'No'}</span>)}
              {ttoRep && renderFormRow('TTO Rep', <span className="font-medium text-right">{ttoRep}</span>)}
           </div>
         </details>

         <div className="flex items-center justify-between text-sm font-medium border-t pt-3 mt-2">
             <span>Estimated {tradeMode === 'buy' ? 'Cost' : 'Proceeds'}</span>
             <span className="font-medium">${estimatedCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {isOptionTrade && <span className='text-xs text-muted-foreground'>({quantity} x ${currentLimitPrice.toFixed(2)} x 100)</span>}</span>
          </div>
          <div className="pt-2 space-y-1">
            <label htmlFor="notes-review" className="block text-sm font-medium text-muted-foreground">
                 Notes
             </label>
             <textarea
                 id="notes-review"
                 ref={notesTextareaRef}
                 value={notes}
                 onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                 placeholder="Additional notes or instructions..."
                 className={cn(
                     "flex min-h-[60px] w-full rounded-md border border-input bg-gray-100 dark:bg-neutral-800 px-3 py-2 text-sm",
                     "ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                     "resize-none"
                 )}
             />
         </div>
      </div>

      <div className="space-y-2">
        <Button onClick={handleConfirmOrder} className="w-full" > 
          Confirm Order
        </Button>
        <Button variant="outline" onClick={handleBackToEntry} className="w-full">
          Edit Order
        </Button>
      </div>
      <div className="text-center text-xs text-muted-foreground mt-2">
        Market orders may execute at different prices. Brokerage fees may apply.
      </div>
    </div>
  );

  const renderOrderConfirmation = () => (
     <div className="space-y-6 ">
      <h3 className="text-sm font-sans">Order Confirmation</h3>
      <div className="flex flex-col items-center justify-center py-2 space-y-3">
         <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
           orderStatus === 'filled' 
             ? 'bg-green-300 dark:bg-green-900' 
             : 'bg-lime-300 dark:bg-lime-900'
         }`}>
          <Check className={`w-6 h-6 ${
            orderStatus === 'filled' 
              ? 'text-green-700 dark:text-green-400' 
              : 'text-lime-700 dark:text-lime-400'
          }`} />
        </div>
        <h4 className="text-2xl font-serif">
          {orderStatus === 'filled' ? 'Order Filled' : 'Order Submitted'}
        </h4>
        <p className="text-sm text-muted-foreground text-center">
          {orderStatus === 'filled' 
            ? `Your ${orderType} order to ${tradeMode} ${quantity} ${symbol?.toUpperCase()} ${isOptionTrade && `${strikePrice?.toFixed(2)} ${optionType?.toUpperCase()}`} ${isOptionTrade ? (quantity === 1 ? 'contract' : 'contracts') : (quantity === 1 ? 'share' : 'shares')} has been filled.`
            : `Your order to ${tradeMode} ${quantity} ${symbol?.toUpperCase()} ${isOptionTrade && `${strikePrice?.toFixed(2)} ${optionType?.toUpperCase()}`} ${isOptionTrade ? (quantity === 1 ? 'contract' : 'contracts') : (quantity === 1 ? 'share' : 'shares')} has been submitted and is pending.`
          }
        </p>
      </div>
       <div className="text-sm">
          {renderFormRow('Order ID', <span className="font-medium text-right">ORD-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>)}
          {renderFormRow(isOptionTrade ? 'Contract' : 'Action', <span className="font-medium capitalize text-right">{isOptionTrade ? `${quantity}x ${symbol?.toUpperCase()} ${strikePrice?.toFixed(2)} ${optionType?.toUpperCase()} ${quantity === 1 ? 'Contract' : 'Contracts'}` : `${tradeMode} ${quantity} ${symbol?.toUpperCase()} ${quantity === 1 ? 'Share' : 'Shares'}`}</span>)}
          {isOptionTrade && renderFormRow('Action', <span className="font-medium text-right">{getOptionActionText()}</span>)}
          {renderFormRow('Account', <span className="font-medium text-right">{accountDetails.name} ({accountId})</span>)}
          {renderFormRow(isOptionTrade ? 'Contracts' : 'Quantity', <span className="font-medium text-right">{quantity} {isOptionTrade ? (quantity === 1 ? 'contract' : 'contracts') : (quantity === 1 ? 'share' : 'shares')}</span>)}
          {!isMutualFund && renderFormRow('Order Type', <span className="font-medium capitalize text-right">{orderType === 'stop-limit' ? 'Stop-Limit' : orderType} Order</span>)}
          {orderType === 'limit' && renderFormRow('Limit Price', <span className="font-medium text-right">${currentLimitPrice.toFixed(2)}</span>)}
          {orderType === 'stop' && renderFormRow('Stop Price', <span className="font-medium text-right">${stopPrice.toFixed(2)}</span>)}
          {orderType === 'stop-limit' && (
            <>
              {renderFormRow('Stop Price', <span className="font-medium text-right">${stopPrice.toFixed(2)}</span>)}
              {renderFormRow('Limit Price', <span className="font-medium text-right">${stopLimitPrice.toFixed(2)}</span>)}
            </>
          )}
          {renderFormRow('Time in Force', <span className="font-medium uppercase text-right">{timeInForce}</span>)}
          {renderFormRow('Est. Cost/Proceeds', <span className="font-medium text-right">${estimatedCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>)}
          {renderFormRow('Status', 
             <div className="flex items-center justify-end gap-1.5">
                 <span className={`w-2 h-2 rounded-full ${
                   orderStatus === 'filled' 
                     ? 'bg-green-500' 
                     : 'bg-yellow-400 animate-pulse'
                 }`}></span> 
                 <span className="font-medium">
                   {orderStatus === 'filled' ? 'Filled' : 'Pending'}
                 </span>
              </div>
          )}
          {notes && renderFormRow('Notes', <span className="font-medium whitespace-pre-wrap text-right">{notes}</span>)}
       </div>
      <div className="space-y-2">
         <Button variant="secondary" className="w-full" onClick={handleNewOrder}>
           Place New Order
         </Button>
         <Button variant="outline" className="w-full" onClick={() => { /* Navigate to orders */ }}>
           View Order Status
         </Button>
       </div>
     </div>
   );

  return (
    <div className="relative space-y-4 text-sm min-h-[500px]">
      {/* Close Button */} 
      {onClose && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={onClose}
          aria-label="Close trade panel"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      {/* Account Selection Modal */} 
      <AccountSelectionModal
          isOpen={isAccountModalOpen}
          onOpenChange={setIsAccountModalOpen}
          onAccountSelect={handleAccountSelect}
      />

      {/* Conditional Rendering based on Order State */}
      {orderState === 'entry' && renderOrderEntry()}
      {orderState === 'review' && renderOrderReview()}
      {orderState === 'confirmation' && renderOrderConfirmation()}
    </div>
  );
} 