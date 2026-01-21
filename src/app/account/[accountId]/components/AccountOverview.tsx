'use client'
import { HoldingsTable } from '@/app/account/[accountId]/components/HoldingsTable'
import { DonutChart } from '@/components/charts/DonutChart'
import { Info, RefreshCcw } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const dummyData = {
  portfolioValue: '$10,282,795.01',
  todaysGL: {
    amount: '+$61,269.66',
    percentage: '0.99%',
  },
  totalGL: {
    amount: '+$1,401,827.44',
    percentage: '13.99%',
  },
  positions: {
    long: { amount: '$10,854,061.39' },
    short: { amount: '-$571,266.38' },
  },
  availableCash: '$1,142,532.78',
  fdicSweep: '$250,000.00',
  totalAccountValue: '$5,712,663.89',
  assetAllocation: [
    { name: 'Mutual funds', value: 35, color: '#8B5CF6' },
    { name: 'Equity', value: 25, color: '#10B981' },
    { name: 'Options', value: 20, color: '#F59E0B' },
    { name: 'Other', value: 20, color: '#6B7280' },
  ],
}

export function AccountOverview() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium mb-4">Overview</h2>

      <div className="grid grid-cols-3xl:grid-cols-2 gap-6">
        {/* Portfolio Card */}
        <div className="cols-span-2 flex flex-col justify-between rounded-2xl border bg-accent dark:border-[#2e323f] p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex flex-col gap-2 flex-1">
                <span className="text-sm font-medium text-black dark:text-white">Portfolio Market Value</span>
                <span className="text-2xl font-medium  text-black dark:text-white">{dummyData.portfolioValue}</span>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm space-y-2">
                    <span className="text-gray-500 dark:text-gray-400">Today&apos;s G/L</span>
                    <span className="text-[#4ade80] dark:text-[#bcff64]">
                      {dummyData.todaysGL.amount} ({dummyData.todaysGL.percentage})
                    </span>
                  </div>
                  <div className="flex justify-between text-sm space-y-2">
                    <span className="text-gray-500 dark:text-gray-400">Total G/L</span>
                    <span className="text-[#4ade80] dark:text-[#bcff64]">
                      {dummyData.totalGL.amount} ({dummyData.totalGL.percentage})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-end flex-1 border-t pt-4 md:border-t-0 md:pt-0 md:border-l md:pl-6 border-gray-200 dark:border-[#2e323f]">
                <div className="flex justify-between text-sm mb-1 space-y-2">
                  <span className="text-gray-500 dark:text-gray-400">Long</span>
                  <span className="text-black dark:text-white">{dummyData.positions.long.amount}</span>
                </div>
                <div className="flex justify-between text-sm space-y-2">
                  <span className="text-gray-500 dark:text-gray-400">Short</span>
                  <span className="text-red-500">{dummyData.positions.short.amount}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-lg  space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Available Cash</p>
                <p className="text-md  font-mono">{dummyData.availableCash}</p>
              </div>
              <div className="rounded-lg  space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">FDIC Sweep</p>
                <p className="text-md  font-mono">{dummyData.fdicSweep}</p>
              </div>
              <div className="rounded-lg space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Account Value</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                          <Info className="w-4 h-4 text-gray-400" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Total value includes cash, investments, and other assets in your account</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-md  font-mono dark:text-white">{dummyData.totalAccountValue}</p>
              </div>
            </div>
          </div>

          <div className="border-t mt-6 pt-3 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 dark:border-[#2e323f]">
            <span>Updated 09/22/2025 3:35 PM ET</span>
            <button className="p-1.5 rounded-md hover:bg-gray-700 transition">
              <RefreshCcw className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Asset Allocation Card */}
        <div className="rounded-xl bg-accent p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Asset Allocation</h2>
            <button className="text-sm text-[#6366f1] hover:underline">Expand view</button>
          </div>

          {/* New flex container for chart and legend */}
          <div className="flex items-center gap-6 mt-4">
            {/* Chart Container - Removed justify-center */}
            <div className="flex-shrink-0 col-span-2">
              <DonutChart data={dummyData.assetAllocation} />
            </div>

            {/* Legend Container - Changed to flex-col, removed grid/centering */}
            <div className="flex flex-col gap-2 text-sm"> 
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]"></span>
                Mutual funds
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                Equity
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
                Options
              </div>
              <span className="text-gray-400">+3 more</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700 text-xs text-gray-400">
            <span>Updated 09/22/2025 3:35 PM ET</span>
            <button className="p-1.5 rounded-md hover:bg-gray-700 transition">
              <RefreshCcw className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          
        </div>
        <div className="xl:col-span-2">
  <HoldingsTable holdingsWithDetails={[]} />
</div>
      </div>
    </div>
  )
}