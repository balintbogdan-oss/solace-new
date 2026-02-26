import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Rectangle } from 'recharts';
import { TooltipProps } from 'recharts';
import { useTheme } from 'next-themes';
import { useSettings } from '@/contexts/SettingsContext';
import { WidgetHeader } from './types'; // Import WidgetHeader type

// Helper function to darken a hex color by mixing with black
const darkenColor = (hex: string, amount: number): string => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse hex to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Mix with black (0, 0, 0) by the specified amount
  const newR = Math.round(r * (1 - amount));
  const newG = Math.round(g * (1 - amount));
  const newB = Math.round(b * (1 - amount));
  
  // Convert back to hex
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
};

// Define commission type alias if not imported globally
type CommissionType = 'Net' | 'Gross';

// Define data for different views
const commissionValues = {
  Net: 27507.29,
  Gross: 45340.53,
};

const commissionLabels = {
  Net: 'April 2025 total commission',
  Gross: 'Total commission earned last month',
};

// Rotated Net Data (ends with Apr)
const monthlyNetData = [
  // Original May to Feb
  { month: 'May', value: 19500 },
  { month: 'Jun', value: 23000, bonus: 8000 }, 
  { month: 'Jul', value: 24000 },
  { month: 'Aug', value: 26500 },
  { month: 'Sep', value: 25000 },
  { month: 'Oct', value: 28000 },
  { month: 'Nov', value: 29500 },
  { month: 'Dec', value: 27000 },
  { month: 'Jan', value: 30000 },
  { month: 'Feb', value: 28500 },
  // Original Mar, Apr moved to end
  { month: 'Mar', value: 22500 },
  { month: 'Apr', value: 21000 },
];

// Rotated Gross Data (ends with Apr)
const monthlyGrossData = [
  // Original May to Feb
  { month: 'May', value: 27500 },
  { month: 'Jun', value: 33000 }, 
  { month: 'Jul', value: 35000 },
  { month: 'Aug', value: 38000 },
  { month: 'Sep', value: 36000 },
  { month: 'Oct', value: 40000 },
  { month: 'Nov', value: 42500 },
  { month: 'Dec', value: 39000 },
  { month: 'Jan', value: 44000 },
  { month: 'Feb', value: 41000 },
  // Original Mar, Apr moved to end
  { month: 'Mar', value: 31000 },
  { month: 'Apr', value: 29000 },
];

// Helper to determine year based on month for the tooltip
const getYearForMonth = (monthLabel: string): string => {
  const months2025 = ['Jan', 'Feb', 'Mar', 'Apr'];
  return months2025.includes(monthLabel) ? '2025' : '2024';
};

// Custom Tooltip Component
const CustomCommissionTooltip = ({ active, payload, label, commissionColor, bonusColor }: TooltipProps<number, string> & { commissionColor?: string, bonusColor?: string }) => {
  if (active && payload && payload.length) {
    const commissionValue = payload[0].value;
    // Bonus value will only exist in payload[1] for Net view June bar
    const bonusValue = payload[1]?.value; 
    const formattedCommission = commissionValue ? `$${commissionValue.toLocaleString()}` : 'N/A';
    const formattedBonus = bonusValue ? `$${bonusValue.toLocaleString()}` : null;
    const year = getYearForMonth(label);

    return (
      <div className="rounded-md border p-2 shadow-sm backdrop-blur-lg bg-white/70 dark:bg-black/70">
        <div className="flex flex-col gap-1.5">
          <span className="text-[0.7rem] uppercase text-muted-foreground">{`${label} ${year}`}</span>
          <div className="flex items-center gap-2">
            {/* Use hardcoded color for commission tooltip indicator */} 
            {commissionColor && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: commissionColor }}></span>}
            <span className="text-foreground text-sm">Commission: {formattedCommission}</span>
          </div>
          {/* Bonus Line (conditional on bonusValue existing) */}
          {formattedBonus && bonusColor && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: bonusColor }}></span>
              <span className="text-foreground text-sm">Bonus: {formattedBonus}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

// Define type for props passed to custom bar shape
interface CommissionBarShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  payload?: { bonus?: number }; // Include payload with optional bonus
  // Add other potential props if needed based on Recharts Bar source/docs
}

const renderCommissionBarShape = (props: CommissionBarShapeProps) => {
  const { payload } = props;
  // If no bonus exists (Gross view OR Net view non-June), round top.
  // If bonus exists (Net view June), round bottom.
  // Define radius type explicitly as a tuple
  const radius: [number, number, number, number] = 
    !payload?.bonus ? [4, 4, 0, 0] : [0, 0, 4, 4]; 
  // Use default fill from props
  return <Rectangle {...props} radius={radius} />; 
};

// Define props for the widget, including the new type
interface CommissionWidgetProps {
  header: WidgetHeader; // Add standard header prop (may be unused)
  children?: React.ReactNode; // Add standard children prop (may be unused)
  commissionViewType?: CommissionType; // Make specific prop optional or handle differently
}

export function CommissionWidget({ commissionViewType = 'Net' }: CommissionWidgetProps) { // Default to 'Net'
  const { theme } = useTheme();
  const { appearanceSettings } = useSettings();
  const [isMounted, setIsMounted] = useState(false);
  const [bonusColor, setBonusColor] = useState('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      // Create a darker version of the primary color by mixing with black
      const primaryColor = appearanceSettings.chartPrimaryColor || '#d4af37';
      const darkenedColor = darkenColor(primaryColor, 0.3); // 30% darker
      setBonusColor(darkenedColor);
    }
  }, [isMounted, theme, appearanceSettings.chartPrimaryColor]);

  if (!isMounted || !bonusColor) {
    return <div className="h-full flex items-center justify-center text-muted-foreground">Loading...</div>;
  }

  const commissionColor = appearanceSettings.chartPrimaryColor || '#BEA36F';

  // Get the value and label based on the passed prop
  const displayValue = commissionValues[commissionViewType];
  const displayLabel = commissionLabels[commissionViewType];

  // Define YTD value for Gross view
  const ytdValue = 88375.00;

  // Select data based on view type
  const chartData = commissionViewType === 'Net' ? monthlyNetData : monthlyGrossData;

  return (
    <div className="h-full flex flex-col lg:flex-row lg:gap-6">
      <div className="flex flex-col mb-4 lg:w-1/3 lg:shrink-0 lg:mb-0">
        <h2 className="text-3xl mb-1">
          {displayValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </h2>
        <div className="text-xs text-muted-foreground mb-4">
          {displayLabel}
        </div>

        <div className="flex flex-row items-start gap-6 text-sm lg:flex-col lg:gap-4">
          {commissionViewType === 'Net' ? (
            // Net View: Show two columns side by side
            <>
              <div className="space-y-1">
                <div className="text-sm font-medium">$67,251.58</div>
                <div className="text-xs text-muted-foreground">Jan 1 to Feb 28, 2025</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">$15,000.00</div>
                <div className="text-xs text-muted-foreground">Payable bonus 2024</div>
              </div>
            </>
          ) : (
            // Gross View: Show YTD column
            <div className="space-y-1">
              <div className="text-sm font-medium">
                {ytdValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </div>
              <div className="text-xs text-muted-foreground">Year to date</div>
            </div>
          )}
        </div>
      </div>

      <div className="h-[200px] mt-auto lg:h-full lg:w-2/3 lg:flex-1 lg:mt-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="commissionGradientLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={commissionColor} />
                <stop offset="100%" stopColor={commissionColor} stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="commissionGradientDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={commissionColor} />
                <stop offset="100%" stopColor={commissionColor} stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              fontSize={12}
              className="text-muted-foreground"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              fontSize={12}
              tickFormatter={(value) => `$${value / 1000}k`}
              className="text-muted-foreground"
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              content={<CustomCommissionTooltip commissionColor={commissionColor} bonusColor={bonusColor} />}
            />
            <Bar 
              dataKey="value" 
              fill={theme === 'dark' ? "url(#commissionGradientDark)" : "url(#commissionGradientLight)"}
              stackId="a"
              shape={renderCommissionBarShape}
            />
            {/* Bonus Bar (Only rendered for Net view) */}
            {commissionViewType === 'Net' && (
              <Bar 
                dataKey="bonus" 
                fill={bonusColor} 
                radius={[4, 4, 0, 0]} // Always round top when rendered
                stackId="a"
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 