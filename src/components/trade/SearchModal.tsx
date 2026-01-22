'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { getAllStocks } from '@/services/marketDataService'
import { useSidebar } from '@/contexts/SidebarContext'

interface SearchModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSelectSymbol: (symbol: string) => void
}

export function SearchModal({ isOpen, onOpenChange }: SearchModalProps) {
  const router = useRouter()
  const params = useParams()
  const { collapseForTrading } = useSidebar()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'stocks' | 'mutual-funds'>('all')
  const [allSecurities, setAllSecurities] = useState<unknown[]>([])
  const [filteredSecurities, setFilteredSecurities] = useState<unknown[]>([])

  // Helper function to navigate with query parameters
  const navigateToSymbol = (symbol: string, type?: 'equities' | 'options') => {
    const accountId = params?.accountId
    const basePath = accountId ? `/account/${accountId}/trade/${symbol}` : `/trade/${symbol}`
    const url = type ? `${basePath}?type=${type}` : basePath
    // Collapse sidebar when entering trading mode from search
    collapseForTrading()
    router.push(url)
    onOpenChange(false)
  }

  // Load all securities when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadSecurities = async () => {
        try {
          const securities = await getAllStocks()
          setAllSecurities(securities)
        } catch (error) {
          console.error('Error loading securities:', error)
        }
      }
      loadSecurities()
    }
  }, [isOpen])

  // Filter securities based on search query and filter
  useEffect(() => {
    let filtered = allSecurities

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
           const uniqueSecurities = filtered.reduce((acc: unknown[], current: unknown) => {
             const currentSecurity = current as { symbol: string }
             const existingIndex = acc.findIndex((security: unknown) => (security as { symbol: string }).symbol === currentSecurity.symbol)
             if (existingIndex === -1) {
               acc.push(current)
             }
             return acc
           }, [])

    setFilteredSecurities(uniqueSecurities)
  }, [searchQuery, allSecurities, activeFilter])

  const clearSearch = () => {
    setSearchQuery('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[1000px] max-w-none max-h-[600px] overflow-y-auto p-6 border bg-white dark:bg-black">
        <DialogTitle></DialogTitle>
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search stocks, options, funds by symbol or name..."
              className="w-full pl-10 pr-10 py-2 border rounded-lg bg-input text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-muted-foreground">Filter by</div>
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-black text-white'
                    : 'bg-accent text-accent-foreground hover:bg-accent/80'
                }`}
                onClick={() => setActiveFilter('all')}
              >
                All
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === 'stocks'
                    ? 'bg-black text-white'
                    : 'bg-accent text-accent-foreground hover:bg-accent/80'
                }`}
                onClick={() => setActiveFilter('stocks')}
              >
                Stocks
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === 'mutual-funds'
                    ? 'bg-black text-white'
                    : 'bg-accent text-accent-foreground hover:bg-accent/80'
                }`}
                onClick={() => setActiveFilter('mutual-funds')}
              >
                Mutual Funds
              </button>
            </div>
          </div>

          {/* Results Table */}
          <div className="space-y-2 min-h-[500px]">
            {filteredSecurities.length > 0 ? (
              <>
                {/* Table Header */}
                <div className="grid grid-cols-4 gap-4 py-2 px-3 text-sm font-medium text-muted-foreground border-b">
                  <div>Symbol</div>
                  <div>Description</div>
                  <div>CUSIP</div>
                  <div>Asset class</div>
                </div>
                
                {/* Table Rows */}
                <div className="space-y-1">
                  {filteredSecurities.map((security: any, index) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                    const isMutualFund = security.sector === 'Mutual Fund'
                    return (
                      <div
                        key={`${security.symbol}-${index}`}
                        className="group relative grid grid-cols-4 gap-4 py-3 px-3 rounded-md transition-all duration-200 hover:bg-muted cursor-pointer"
                        onClick={() => {
                          if (isMutualFund) {
                            navigateToSymbol(security.symbol)
                          } else {
                            // For stocks, clicking the row goes to stock details (equities tab)
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
                        <div className={`text-sm text-muted-foreground ${!isMutualFund ? 'group-hover:opacity-0' : ''} transition-opacity duration-200`}>
                          {isMutualFund ? 'Mutual Fund' : 'Stocks'}
                        </div>
                        
                        {/* Hover Actions for Stocks */}
                        {!isMutualFund && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                            <button
                              className="px-4 py-2 text-sm bg-white text-black rounded-md hover:bg-gray-100 transition-colors shadow-sm"
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
                  })}
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                {searchQuery.trim() 
                  ? `No securities found for "${searchQuery}"`
                  : 'No securities available'
                }
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}