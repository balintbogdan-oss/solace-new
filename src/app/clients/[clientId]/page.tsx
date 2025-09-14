'use client'

import {
  User,
  ChevronDown,
  Mail,
  Phone,
  Calendar,
  Hash,
  ChevronRight,
  Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ComposedChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine, Area, CartesianGrid, TooltipProps } from 'recharts'
import { generateMockData } from '@/lib/mockData'
import { useTheme } from 'next-themes'
import { Card } from '@/components/ui/card'
import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import React from 'react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ClientDataProvider, useClientData } from '@/contexts/ClientDataContext'

// Define TimePeriod type locally
type TimePeriod = '1D' | '1W' | '1M' | '6M' | 'YTD' | '1Y'
const TIME_PERIODS: TimePeriod[] = ['1D', '1W', '1M', '6M', 'YTD', '1Y']

// Helper function to generate monthly ticks (similar to AUMWidget)
const getMonthlyTicks = (data: Array<{ timestamp: number }>) => {
  if (!data || data.length === 0) return []
  const ticks: number[] = []
  const uniqueMonths = new Set<string>()
  data.forEach(point => {
    const date = new Date(point.timestamp)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`
    if (!uniqueMonths.has(monthKey)) {
      uniqueMonths.add(monthKey)
      const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
      ticks.push(firstOfMonth.getTime())
    }
  })
  return ticks.sort((a, b) => a - b)
}

// Custom Tooltip Component (adapt from AUMWidget)
const CustomClientTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  const pointData = payload?.[0]?.payload as { value?: number; netDeposit?: number } | undefined
  if (active && pointData && label) {
    const date = new Date(label)
    const formattedLabel = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    const formattedValue = pointData.value != null ? `$${pointData.value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : 'N/A'
    const formattedDeposit = pointData.netDeposit != null ? `$${pointData.netDeposit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : 'N/A'
    return (
      <div className="rounded-md border p-2 shadow-sm backdrop-blur-lg bg-background">
        <div className="flex flex-col gap-1.5 text-sm">
          <span className="text-[0.7rem] uppercase text-muted-foreground">{formattedLabel}</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-positive))' }}></span>
            <span className="text-foreground text-xs">Portfolio Value: {formattedValue}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-secondary))' }}></span>
            <span className="text-foreground text-xs">Cash/Sweep: {formattedDeposit}</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

// Client content component that uses the context
function ClientContent() {
  const router = useRouter()
  const { data, loading, error } = useClientData()
  
  // State for collapsed sections
  const [isPersonalAccountsCollapsed, setIsPersonalAccountsCollapsed] = useState(false)

  // State for chart
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1Y')
  const [hoveredTimestamp, setHoveredTimestamp] = useState<number | null>(null)
  const { theme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)
  const [portfolioColor, setPortfolioColor] = useState('')
  const [cashColor, setCashColor] = useState('')

  // Calculate total portfolio value from accounts
  const totalPortfolioValue = useMemo(() => {
    if (!data?.accounts) return 0
    return data.accounts.reduce((sum, account) => {
      return sum + (account.balances?.totalValue || 0)
    }, 0)
  }, [data?.accounts])

  // Generate Chart Data (adapt base value and volatility)
  const clientChartData = useMemo(() => generateMockData({
    baseValue: totalPortfolioValue || 4000000, 
    months: 12, 
    volatility: 0.02 // Example volatility
  }), [totalPortfolioValue])

  // Filter data based on selectedPeriod (similar to AUMWidget)
  const filteredClientChartData = useMemo(() => {
    const endDate = new Date(clientChartData[clientChartData.length - 1]?.timestamp || Date.now())
    let startDate = new Date(endDate)
    switch (selectedPeriod) {
      case '1D': startDate.setDate(endDate.getDate() - 1); break
      case '1W': startDate.setDate(endDate.getDate() - 7); break
      case '1M': startDate.setMonth(endDate.getMonth() - 1); break
      case '6M': startDate.setMonth(endDate.getMonth() - 6); break
      case 'YTD': startDate = new Date(endDate.getFullYear(), 0, 1); break
      case '1Y': default: startDate.setFullYear(endDate.getFullYear() - 1); break
    }
    const startTime = startDate.getTime()
    return clientChartData.filter(d => d.timestamp >= startTime)
  }, [selectedPeriod, clientChartData])

  // Calculate chart domains and ticks (similar to AUMWidget)
  const monthlyTicks = useMemo(() => getMonthlyTicks(filteredClientChartData), [filteredClientChartData])
  const { yAxisTicks, yAxisDomain } = useMemo(() => {
    if (!clientChartData || clientChartData.length === 0) return { yAxisTicks: [], yAxisDomain: [0, 1] }
    const values = clientChartData.map(d => d.value)
    const deposits = clientChartData.map(d => d.netDeposit)
    const dataMin = Math.min(...values, ...deposits)
    const dataMax = Math.max(...values, ...deposits)
    const range = dataMax - dataMin
    const desiredTicks = 5
    const roughIncrement = range > 0 ? range / (desiredTicks - 1) : totalPortfolioValue / 10
    let increment = 1_000_000
    const thresholds = [50_000_000, 25_000_000, 10_000_000, 5_000_000, 2_500_000, 1_000_000, 500_000, 100_000, 50_000, 10_000, 1_000]
    for (const t of thresholds) {
      if (roughIncrement > t * (desiredTicks / 2)) { // Adjusted logic slightly
        increment = t
        break
      }
    }
    const tickMin = Math.floor(dataMin / increment) * increment
    const tickMax = Math.ceil(dataMax / increment) * increment
    const ticks = []
    for (let tick = tickMin; tick <= tickMax; tick += increment) {
      ticks.push(tick)
    }
    if (ticks.length < 2 && tickMin === tickMax) {
       ticks.push(tickMin + (increment > 0 ? increment : 1)) 
    }
    const domain: [number, number] = [tickMin, tickMax > tickMin ? tickMax : tickMin + (increment > 0 ? increment : 1)]
    return { yAxisTicks: ticks, yAxisDomain: domain }
  }, [clientChartData, totalPortfolioValue])
  const xAxisDomain: [number, number | string] = useMemo(() => {
      if (!filteredClientChartData || filteredClientChartData.length === 0) return [0, 1]
      return [filteredClientChartData[0].timestamp, 'dataMax']
  }, [filteredClientChartData])

  // Effect for mounting
  useEffect(() => { setIsMounted(true) }, [])

  // Effect for theme colors
  useEffect(() => {
    if (isMounted) {
      const style = getComputedStyle(document.documentElement)
      const positiveColor = style.getPropertyValue('--chart-positive').trim()
      const secondaryColor = style.getPropertyValue('--chart-secondary').trim()
      setPortfolioColor(positiveColor.startsWith('hsl') ? positiveColor : `hsl(${positiveColor})`)
      setCashColor(secondaryColor.startsWith('hsl') ? secondaryColor : `hsl(${secondaryColor})`)
    }
  }, [isMounted, theme])

  if (loading) {
    return (
      <div className="min-h-screen w-full p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading client data...</div>
        </div>
      </div>
    )
  }

  if (error || !data?.client) {
    return (
      <div className="min-h-screen w-full p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-destructive">Error: {error || 'Client not found'}</div>
        </div>
      </div>
    )
  }

  const client = data.client
  const accounts = data.accounts || []

  // Chart mouse handlers
  const handleMouseMove = (state: unknown) => {
    const anyState = state as { activeCoordinate?: unknown; activePayload?: Array<{ payload?: { timestamp?: number } }> };
    if (state && anyState.activeCoordinate) {
      const payloadData = anyState.activePayload?.[0]?.payload
      if (payloadData?.timestamp) { setHoveredTimestamp(payloadData.timestamp); return; }
    }
    setHoveredTimestamp(null)
  }
  const handleMouseLeave = () => { setHoveredTimestamp(null) }


  return (
    <div className="min-h-screen w-full p-6">
        <div className='pb-6'>
          <h1 className="text-4xl font-serif">
            {data?.client ? `${data.client.firstName} ${data.client.lastName}` : 'Loading...'}
          </h1>
          <h2 className="text-2xl font-serif text-muted-foreground mt-2">Client overview</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4  ">
          {/* Left Column - Chart and Accounts */}
          {/* Portfolio Chart Card */}
          <Card className="lg:col-span-2 space-y-4 rounded-lg bg-card p-6 border">
              
              {/* Top row container */} 
              <div className="flex justify-between items-start mb-4"> 
                {/* Left side: Value + G/L */} 
                <div className="space-y-2">
                <span className="text-muted-foreground text-sm mb-2">Portfolio Market Value</span>
                  <div className="text-xl md:text-3xl font-serif">${totalPortfolioValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Today&apos;s G/L</span>
                      <span className="text-sm text-positive">+$0.00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Total Unrealized G/L</span>
                      <span className="text-sm text-positive">+$0.00</span>
                    </div>
                  </div>
                </div>

                {/* Right side: Dropdown + Timeframe + Legend */} 
                <div className="flex flex-col items-end space-y-2"> 
                   <div className="flex items-center gap-2"> {/* Container for Dropdown and Timeframe */} 
                     {/* Client Dropdown */} 
                     <DropdownMenu>
                       <DropdownMenuTrigger asChild>
                         <Button variant="outline" className="flex items-center gap-2">
                           <span>{client.firstName} {client.lastName}</span>
                           <ChevronDown className="h-4 w-4 opacity-50" />
                         </Button>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent align="end">
                         {accounts.some(acc => acc.householdId) && (
                           <DropdownMenuItem 
                             onClick={() => {
                               const householdId = accounts.find(acc => acc.householdId)?.householdId
                               if (householdId) {
                                 router.push(`/households/${householdId}`)
                               }
                             }}
                           >
                             <Building2 className="w-4 h-4 mr-2" />
                             View Household
                           </DropdownMenuItem>
                         )}
                         <DropdownMenuItem>Add Comparison</DropdownMenuItem>
                       </DropdownMenuContent>
                     </DropdownMenu>
                    
                    {/* Timeframe switcher */} 
                     <div className="flex items-center bg-muted p-1 rounded-md space-x-1">
                      {TIME_PERIODS.map((period) => (
                        <Button
                          key={period}
                          variant={selectedPeriod === period ? 'secondary' : 'ghost'}
                          onClick={() => setSelectedPeriod(period)}
                          className="px-2.5 h-7 text-xs"
                        >
                          {period}
                        </Button>
                      ))}
                    </div>
                  </div>
                  {/* Chart Legend */} 
                  <div className="flex space-x-4 text-xs text-muted-foreground items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-1" style={{ backgroundColor: portfolioColor }}></span>
                        <span>Portfolio Value</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-1" style={{ backgroundColor: cashColor }}></span>
                        <span>Cash/Sweep</span>
                      </div>
                  </div>
                </div>
              </div>

              {/* Recharts Implementation */}
              <div className="mt-4 w-full h-[250px]">
                {!isMounted || !portfolioColor || !cashColor ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground">Loading...</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart 
                      data={filteredClientChartData}
                      margin={{ top: 5, right: 0, left: 0, bottom: 0 }} // Simplified margins
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                    >
                      <defs>
                        <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={portfolioColor} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={portfolioColor} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid 
                        vertical={false}
                        stroke="hsl(var(--border))" // Use border color
                        strokeDasharray="3 3" 
                        opacity={0.5} // Adjusted opacity
                      />
                      <XAxis 
                        dataKey="timestamp"
                        type="number"
                        domain={xAxisDomain}
                        ticks={monthlyTicks}
                        fontSize={12}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                        className="text-muted-foreground"
                        axisLine={false}
                        tickLine={false}
                        allowDataOverflow={true}
                      />
                      <YAxis 
                        yAxisId="left"
                        tickFormatter={(value) => { // Dynamic Y-axis formatting
                            if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(0)}M`;
                            if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
                            return `$${value.toFixed(0)}`;
                        }}
                        fontSize={12}
                        className="text-muted-foreground"
                        axisLine={false}
                        tickLine={false}
                        domain={yAxisDomain}
                        ticks={yAxisTicks}
                        width={50} // Give Y-axis some space
                      />
                      <Tooltip 
                        content={<CustomClientTooltip />} // Use our custom tooltip
                        cursor={{ stroke: 'hsl(var(--foreground))', strokeWidth: 1, strokeDasharray: '3 3' }} // Customize cursor
                        position={{ y: -60 }}
                      />
                      <Area
                        type="linear"
                        dataKey="value" // Portfolio Value
                        yAxisId="left"
                        stroke={portfolioColor} 
                        strokeWidth={2}
                        fill="url(#portfolioGradient)"
                        dot={false}
                        name="Portfolio Value"
                        baseValue="dataMin"
                      />
                      <Line
                        type="linear"
                        dataKey="netDeposit" // Cash/Sweep
                        yAxisId="left"
                        stroke={cashColor}
                        strokeWidth={2}
                        dot={false}
                        name="Cash/Sweep"
                      />
                      {hoveredTimestamp !== null && (
                        <ReferenceLine 
                          x={hoveredTimestamp} 
                          yAxisId="left"
                          stroke="hsl(var(--foreground))" // Use foreground color
                          strokeWidth={1} 
                          ifOverflow="extendDomain"
                        />
                      )}
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>

          {/* Right Column - Client Profile */}
      
          <div className="lg:col-span-1 rounded-lg bg-card p-6 md:p-6 border">
            <span className="text-muted-foreground text-sm mb-2">Profile</span>
            
            {/* Use grid for alignment */}
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm"> {/* Define columns: auto for label, 1fr for value */} 
              {/* Name (spans both columns or handled separately) - Let's keep it above the grid for simplicity */}
              {/* <div className="col-span-2">
                <h3 className="text-2xl font-serif mb-4">{MOCK_CLIENT.name}</h3>
              </div> */}
              <h3 className="text-2xl font-serif mb-4 col-span-2">{client.firstName} {client.lastName}</h3>

              {/* Email Row */}
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5" />
                <span>Email</span>
              </div>
              <span className="text-left">{client.email || 'N/A'}</span>

              {/* Phone Row */}
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5" />
                <span>Phone</span>
              </div>
              <span className="text-left">{client.phone || 'N/A'}</span>

              {/* Client ID Row */}
              <div className="flex items-center gap-3 text-muted-foreground">
                <Hash className="w-5 h-5" />
                <span>Client ID</span>
              </div>
              <span className="text-left">{client.id}</span>

              {/* Created Date Row */}
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="w-5 h-5" />
                <span>Created</span>
              </div>
              <span className="text-left">{new Date(client.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="pt-6">
              <Button variant="outline" className="w-full">
                View Household clients
              </Button>
            </div>
          </div>
        </div>

        {/* Household Accounts Section */}
        <div className="w-full mt-4 md:mt-6">
          <h2 className="text-2xl font-serif pb-4">Accounts</h2>
          
          {/* Individual Household Box */}
          <Card className="w-full">
            <div className="space-y-2">
              {/* Household Summary Row */}
              <div 
                className="h-16 bg-muted/30 dark:bg-muted/10 cursor-pointer hover:bg-accent dark:hover:bg-accent transition-colors rounded-lg mb-2 flex items-center px-4"
                onClick={() => setIsPersonalAccountsCollapsed(prev => !prev)}
              >
                <div className="flex items-center gap-4 w-full">
                  <User className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-medium flex-1">{client.firstName} {client.lastName}</h3>
                  <div className="text-right font-medium">${totalPortfolioValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                  <ChevronDown 
                    className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform duration-200",
                      isPersonalAccountsCollapsed ? "rotate-180" : ""
                    )} 
                  />
                </div>
              </div>

              <div className="rounded-lg overflow-hidden ">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                     <tr className="font-regular border-b border-t">
                       <th className="w-10 p-2"></th>
                       <th className="text-left text-muted-foreground p-2">Account</th>
                       <th className="text-left text-muted-foreground p-2">Household</th>
                       <th className="text-right text-muted-foreground p-2">Funds Available</th>
                       <th className="text-right text-muted-foreground p-2">Invested value</th>
                       <th className="text-right text-muted-foreground p-2">Market value</th>
                       <th className="text-right text-muted-foreground p-2">Cash + FDIC Sweep</th>
                       <th className="text-right text-muted-foreground p-2">Margin balance</th>
                       <th className="text-right text-muted-foreground p-2 pr-4">Total Account Value</th>
                       <th className="w-4 pr-2"></th></tr>
                      </thead>
                      <tbody>

                        {/* --- Personal Accounts Data Rows (Conditional) --- */}
                        {!isPersonalAccountsCollapsed && accounts.map((account) => (
                         <tr 
                           key={`${client.id}-${account.accountId}`}
                           onClick={() => router.push(`/account/${account.accountId}`)}
                           className=" hover:bg-accent dark:hover:bg-accent cursor-pointer transition-colors"
                         >
                            <td></td> 
                            <td className=" border-t py-2 border-b dark:border-neutral-800"> 
                              <div className="font-semibold">{account.accountName}</div>
                              <div className="text-sm text-muted-foreground">{account.accountId} • {account.accountType}</div></td>
                            <td className="border-t py-2 text-left border-b dark:border-neutral-800">
                              {account.household ? (
                                <div className="flex items-center gap-2">
                                  <Building2 className="w-4 h-4 text-primary" />
                                  <div>
                                    <div className="text-sm font-medium">{account.household.name}</div>
                                    {account.isPrimary && (
                                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-primary text-primary-foreground">
                                        Primary
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>
                            <td className="border-t py-2 text-right text-muted-foreground border-b dark:border-neutral-800">${(account.balances?.buyingPower || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                            <td className="border-t py-2 text-right text-muted-foreground border-b dark:border-neutral-800">${(account.balances?.investedValue || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                            <td className="border-t py-2 text-right text-muted-foreground border-b dark:border-neutral-800">${(account.balances?.totalValue || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                            <td className="border-t py-2 text-right text-muted-foreground border-b dark:border-neutral-800">${(account.balances?.cash || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                            <td className="border-t py-2 text-right text-muted-foreground border-b dark:border-neutral-800">${(account.balances?.margin || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                            <td className="border-t py-2 text-right text-muted-foreground pr-4 border-b dark:border-neutral-800">${(account.balances?.totalValue || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                            <td className="border-t py-2 pr-2 border-b dark:border-neutral-800">
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card>
        </div>
    </div>
  )
}

// Main component that provides the context
export default function ClientDetailPage() {
  const params = useParams()
  const clientId = params?.clientId as string

  if (!clientId) {
    return (
      <div className="min-h-screen w-full p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-destructive">Invalid client ID</div>
        </div>
      </div>
    )
  }

  return (
    <ClientDataProvider clientId={clientId}>
      <ClientContent />
    </ClientDataProvider>
  )
}