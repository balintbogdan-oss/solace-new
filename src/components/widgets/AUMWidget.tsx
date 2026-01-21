'use client'

import { useState, useEffect, useMemo } from 'react';
import { ComposedChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, ReferenceLine, Area, CartesianGrid } from 'recharts';
import { generateMockData } from '@/lib/mockData';
import { TooltipProps } from 'recharts';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSettings } from '@/contexts/SettingsContext';

// Define TimePeriod type locally (or import if central)
// const TIME_PERIODS = ['1D', '1W', '1M', '6M', 'YTD', '1Y'] as const; // Keep commented out
type TimePeriod = '1D' | '1W' | '1M' | '6M' | 'YTD' | '1Y'; // Define type directly

const currentAUM = 126345678.43; // Define the current AUM

const aumData = generateMockData({
  baseValue: 126_000_000, // Updated base value
  months: 12,
  volatility: 0.03 // Adjusted volatility (e.g., 2%)
});

// Helper function to generate monthly ticks
const getMonthlyTicks = (data: typeof aumData) => {
  if (!data || data.length === 0) return [];

  const ticks: number[] = [];
  const uniqueMonths = new Set<string>(); // Format: YYYY-MM

  data.forEach(point => {
    const date = new Date(point.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;

    if (!uniqueMonths.has(monthKey)) {
      uniqueMonths.add(monthKey);
      // Use the timestamp of the *first* point encountered for that month as the tick
      // Or alternatively, calculate the first day of the month timestamp
      const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      ticks.push(firstOfMonth.getTime());
    }
  });

  // Ensure ticks are sorted chronologically
  return ticks.sort((a, b) => a - b);
};

// Custom Tooltip Component (Restore)
// Use generics provided by TooltipProps for payload type safety
const CustomAUMTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  // Access payload data more safely using optional chaining and type assertion if needed
  const pointData = payload?.[0]?.payload as { value?: number; netDeposit?: number } | undefined;

  if (active && pointData && label) {
    const date = new Date(label); // label should be the timestamp here
    const formattedLabel = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const formattedAUM = pointData.value != null ? `$${pointData.value.toLocaleString()}` : 'N/A'; // Check for null/undefined
    const formattedDeposit = pointData.netDeposit != null ? `$${pointData.netDeposit.toLocaleString()}` : 'N/A'; // Check for null/undefined

    return (
      <div className="rounded-md border p-2 shadow-sm backdrop-blur-lg bg-background">
        <div className="flex flex-col gap-1.5 text-sm">
          <span className="text-[0.7rem] uppercase text-muted-foreground">{formattedLabel}</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(var(--positive))' }}></span>
            <span className="text-foreground text-xs">Total AUM: {formattedAUM}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-secondary))' }}></span>
            <span className="text-foreground text-xs">Net Cash Deposits: {formattedDeposit}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Define AUMWidgetProps
interface AUMWidgetProps {
  selectedPeriod?: TimePeriod; // Make optional in case not passed
}

export function AUMWidget({ selectedPeriod = '1Y' }: AUMWidgetProps) { // Default to '1Y'
  const [hoveredTimestamp, setHoveredTimestamp] = useState<number | null>(null);
  const { appearanceSettings } = useSettings();
  const [isMounted, setIsMounted] = useState(false);
  // State to hold computed colors - initialize with defaults
  const [aumColor, setAumColor] = useState('#10b981'); 
  const [depositColor, setDepositColor] = useState('#d4af37');

  // Filter data based on selectedPeriod
  const filteredAumData = useMemo(() => {
    const endDate = new Date(aumData[aumData.length - 1]?.timestamp || Date.now());
    let startDate = new Date(endDate);

    switch (selectedPeriod) {
      case '1D':
        startDate.setDate(endDate.getDate() - 1);
        break;
      case '1W':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '1M':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case '6M':
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case 'YTD':
        startDate = new Date(endDate.getFullYear(), 0, 1); // Jan 1st of current year
        break;
      case '1Y':
      default:
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    const startTime = startDate.getTime();
    return aumData.filter(d => d.timestamp >= startTime);

  }, [selectedPeriod]);

  // Recalculate monthly X ticks based on filtered data
  const monthlyTicks = useMemo(() => getMonthlyTicks(filteredAumData), [filteredAumData]);
  
  // Calculate Y Ticks/Domain based on the FULL dataset
  const { yAxisTicks, yAxisDomain } = useMemo(() => {
    if (!aumData || aumData.length === 0) {
      return { yAxisTicks: [], yAxisDomain: [0, 1] };
    }
    const values = aumData.map(d => d.value);
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    const range = dataMax - dataMin;
    const desiredTicks = 5;
    const roughIncrement = range > 0 ? range / (desiredTicks - 1) : 5_000_000;
    let increment = 5_000_000; 
    if (roughIncrement > 25_000_000) increment = 50_000_000;
    else if (roughIncrement > 10_000_000) increment = 25_000_000;
    else if (roughIncrement > 5_000_000) increment = 10_000_000;
    const tickMin = Math.floor(dataMin / increment) * increment;
    const tickMax = Math.ceil(dataMax / increment) * increment;
    const ticks = [];
    for (let tick = tickMin; tick <= tickMax; tick += increment) {
      ticks.push(tick);
    }
    if (ticks.length < 2 && tickMin === tickMax) {
       ticks.push(tickMin + increment); 
    }
    const domain: [number, number] = [tickMin, tickMax];
    return { yAxisTicks: ticks, yAxisDomain: domain };
  }, []);
  
  const xAxisDomain: [number, number | string] = useMemo(() => {
      if (!filteredAumData || filteredAumData.length === 0) return [0, 1];
      return [filteredAumData[0].timestamp, 'dataMax'];
  }, [filteredAumData]);

  // Effect to read computed styles after mount and on theme change
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Set colors immediately and on changes
    const aumColor = appearanceSettings.chartPositiveColor || '#10b981';
    const depositColor = appearanceSettings.chartPrimaryColor || '#d4af37';
    setAumColor(aumColor);
    setDepositColor(depositColor);
  }, [appearanceSettings.chartPositiveColor, appearanceSettings.chartPrimaryColor]);

  const handleMouseMove = (state: unknown) => {
    // Use optional chaining and type guards for safer access
    // Cast to a structure with optional properties typed as unknown
    const anyState = state as { 
      activeCoordinate?: unknown; 
      activePayload?: Array<{ payload?: { timestamp?: number } }>
    }; 
    
    if (state && anyState.activeCoordinate) {
      // Access payload data carefully using optional chaining
      const payloadData = anyState.activePayload?.[0]?.payload; 
      if (payloadData?.timestamp) { 
        setHoveredTimestamp(payloadData.timestamp);
        return; 
      }
      setHoveredTimestamp(null); 
    } else {
      setHoveredTimestamp(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredTimestamp(null);
  };

  // Render null or placeholder until mounted
  if (!isMounted) {
    return <div className="h-full flex items-center justify-center text-muted-foreground">Loading...</div>; 
  }

  return (
    <div className="h-full flex flex-col">
      {/* Container for AUM value and Legend */}
      <div className="flex justify-between items-start mb-4">
        {/* AUM value display */}
        <h2 className="text-3xl">{currentAUM.toLocaleString('en-US', { style: 'currency', currency: 'USD'})}</h2>
        
        {/* Legend Area - Use computed colors */}
        <div className="flex space-x-4 text-xs text-muted-foreground items-center pt-1">
          {/* Total AUM Legend Item */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1" style={{ backgroundColor: aumColor }}></span>
            <span>Total AUM</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total assets (portfolio market value + cash) of all your clients</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {/* Net Deposits Legend Item */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1" style={{ backgroundColor: depositColor }}></span>
            <span>Net Cash Deposits</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Deposits minus withdrawals</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={filteredAumData}
            margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              {/* Use computed color in gradient */}
              <linearGradient id="aumGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={aumColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={aumColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              vertical={false}
              stroke="hsl(var(--primary))"
              opacity={0.1}
            />
            <XAxis 
              dataKey="timestamp"
              type="number"
              domain={xAxisDomain}
              ticks={monthlyTicks}
              fontSize={12}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { month: 'short' });
              }}
              className="text-muted-foreground"
              axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              allowDataOverflow={true}
            />
            <YAxis 
              yAxisId="left"
              tickFormatter={(value) => `$${(value / 1_000_000).toFixed(0)}M`}
              fontSize={12}
              className="text-muted-foreground"
              axisLine={false}
              tickLine={false}
              domain={yAxisDomain}
              ticks={yAxisTicks}
            />
            <RechartsTooltip 
              content={<CustomAUMTooltip />}
              position={{ y: -60 }}
            />
            {/* AUM Area Chart - Use computed color */}
            <Area
              type="linear"
              dataKey="value"
              yAxisId="left"
              stroke={aumColor} 
              strokeWidth={2}
              fill="url(#aumGradient)"
              dot={false}
              name="AUM"
              baseValue="dataMin"
            />
            {/* Net Deposit Line - Use computed color */}
            <Line
              type="linear"
              dataKey="netDeposit"
              yAxisId="left"
              stroke={depositColor}
              strokeWidth={2}
              dot={false}
              name="Cash Balance"
            />
            {/* Vertical hover line - Moved after Area and Line */}
            {hoveredTimestamp !== null && (
              <ReferenceLine 
                x={hoveredTimestamp} 
                yAxisId="left"
                stroke="hsl(var(--muted-foreground))" 
                strokeWidth={1} 
                ifOverflow="extendDomain" // Ensures line spans the chart height
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 