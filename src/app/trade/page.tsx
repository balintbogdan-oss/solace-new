'use client'

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { getAllStocks } from '@/services/marketDataService'

type FilterType = 'recents' | 'all' | 'stocks' | 'mutual-funds'

// Recent securities (hardcoded for demo) - defined outside component to avoid useEffect dependency issues
const recentSymbols = ['AMZN', 'TSLA', 'APPLX', 'GOOGL', 'NFLX', 'FB', 'BA', 'DIS', 'DAL', 'KO']

export default function GlobalTradePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('recents')
  const [allSecurities, setAllSecurities] = useState<any[]>([]) // eslint-disable-line @typescript-eslint/no-explicit-any
  const [filteredSecurities, setFilteredSecurities] = useState<any[]>([]) // eslint-disable-line @typescript-eslint/no-explicit-any

  // Load all securities on mount
  useEffect(() => {
    const loadSecurities = async () => {
      try {
        const securities = await getAllStocks()
        setAllSecurities(securities)
      } catch (error) {
        console.error('Error loading securities:', error)
      }
    }
    loadSecurities()
  }, [])

  // Filter securities based on search query and filter
  useEffect(() => {
    let filtered = allSecurities

    // Apply recents filter first
    if (activeFilter === 'recents') {
      filtered = filtered.filter((security: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        recentSymbols.includes(security.symbol)
      )
      // Sort by the order in recentSymbols
      filtered.sort((a: any, b: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        recentSymbols.indexOf(a.symbol) - recentSymbols.indexOf(b.symbol)
      )
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((security: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        security.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        security.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply asset class filter
    if (activeFilter === 'stocks') {
      filtered = filtered.filter((security: any) => security.sector !== 'Mutual Fund') // eslint-disable-line @typescript-eslint/no-explicit-any
    } else if (activeFilter === 'mutual-funds') {
      filtered = filtered.filter((security: any) => security.sector === 'Mutual Fund') // eslint-disable-line @typescript-eslint/no-explicit-any
    }

    // Remove duplicates based on symbol
    const uniqueSecurities = filtered.reduce((acc: any[], current: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const existingIndex = acc.findIndex((security: any) => security.symbol === current.symbol) // eslint-disable-line @typescript-eslint/no-explicit-any
      if (existingIndex === -1) {
        acc.push(current)
      }
      return acc
    }, [])

    setFilteredSecurities(uniqueSecurities)
  }, [searchQuery, allSecurities, activeFilter])

  const navigateToSymbol = (symbol: string, type?: 'equities' | 'options') => {
    const basePath = `/trade/${symbol}`
    const url = type ? `${basePath}?type=${type}` : basePath
    router.push(url)
  }

  const filterButtons: { key: FilterType; label: string }[] = [
    { key: 'recents', label: 'Recents' },
    { key: 'all', label: 'All' },
    { key: 'stocks', label: 'Stocks' },
    { key: 'mutual-funds', label: 'Mutual funds' },
  ]

  return (
    <div className="w-full bg-[#F5F3EF] dark:bg-black min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-medium font-serif text-slate-900 dark:text-slate-100">Search securities</h1>
          <p className="text-muted-foreground mt-1">
            Search for anything you want to trade or research
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search stocks, options, funds by symbol or name..."
            className="w-full pl-11 pr-4 py-3 border rounded-lg bg-white dark:bg-card-blend-dark text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm text-muted-foreground">Filter by</span>
          <div className="flex gap-2">
            {filterButtons.map((filter) => (
              <button
                key={filter.key}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter.key
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-transparent text-foreground hover:bg-accent'
                }`}
                onClick={() => setActiveFilter(filter.key)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Table */}
        <div className="mt-4">
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 py-3 px-3 text-sm text-muted-foreground border-b border-border/50">
            <div>Symbol</div>
            <div>Description</div>
            <div>CUSIP</div>
            <div className="text-right">Asset class</div>
          </div>

          {/* Table Rows */}
          <div>
            {filteredSecurities.length > 0 ? (
              filteredSecurities.map((security: any, index: number) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                const isMutualFund = security.sector === 'Mutual Fund'
                return (
                  <div
                    key={`${security.symbol}-${index}`}
                    className="group relative grid grid-cols-4 gap-4 py-4 px-3 border-b border-border/30 transition-all duration-200 hover:bg-white/50 dark:hover:bg-white/5 cursor-pointer"
                    onClick={() => {
                      if (isMutualFund) {
                        navigateToSymbol(security.symbol)
                      } else {
                        navigateToSymbol(security.symbol, 'equities')
                      }
                    }}
                  >
                    <div className="font-medium text-sm">{security.symbol}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {security.description || security.symbol}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {security.cusip || '-'}
                    </div>
                    <div className={`text-sm text-muted-foreground text-right ${!isMutualFund ? 'group-hover:opacity-0' : ''} transition-opacity duration-200`}>
                      {isMutualFund ? 'Mutual fund' : 'Stocks'}
                    </div>

                    {/* Hover Actions for Stocks */}
                    {!isMutualFund && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                        <button
                          className="px-4 py-2 text-sm bg-white text-black rounded-md hover:bg-gray-100 transition-colors shadow-sm border"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigateToSymbol(security.symbol, 'options')
                          }}
                        >
                          Option chain
                        </button>
                        <button
                          className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigateToSymbol(security.symbol, 'equities')
                          }}
                        >
                          Stock details
                        </button>
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="text-center text-muted-foreground py-12">
                {searchQuery.trim()
                  ? `No securities found for "${searchQuery}"`
                  : 'No securities available'
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 