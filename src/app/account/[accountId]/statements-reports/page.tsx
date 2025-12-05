'use client'

export const dynamic = 'force-dynamic';

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { PDFViewer } from '@/components/ui/pdf-viewer'
import { format } from 'date-fns'
import { Download, Eye, Search, Calendar, ExternalLink, Loader2, CheckCircle2, X, ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

type TabType = 'monthly-statements' | 'tax-statements' | 'trade-confirmations' | 'open-order-confirmations' | 'shareholder-documents' | 'quicken'

export default function StatementsReportsPage() {
  const [selectedYear, setSelectedYear] = useState('2025')
  const [selectedTaxYear, setSelectedTaxYear] = useState('2024')
  const [activeTab, setActiveTab] = useState<TabType>('monthly-statements')
  const [searchTerm, setSearchTerm] = useState('')
  // Default to last 30 days: end date = today, start date = 30 days ago
  const getDefaultDateRange = () => {
    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)
    return { start: thirtyDaysAgo, end: today }
  }
  
  const defaultRange = getDefaultDateRange()
  const [startDate, setStartDate] = useState<Date | undefined>(defaultRange.start)
  const [endDate, setEndDate] = useState<Date | undefined>(defaultRange.end)
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)
  
  // Sorting state for trade confirmations
  const [tradeConfirmationsSortColumn, setTradeConfirmationsSortColumn] = useState<'date' | null>(null)
  const [tradeConfirmationsSortDirection, setTradeConfirmationsSortDirection] = useState<'asc' | 'desc'>('desc')
  
  // Sorting state for open order confirmations
  const [openOrderConfirmationsSortColumn, setOpenOrderConfirmationsSortColumn] = useState<'date' | null>(null)
  const [openOrderConfirmationsSortDirection, setOpenOrderConfirmationsSortDirection] = useState<'asc' | 'desc'>('desc')
  
  // PDF Viewer state
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false)
  const [currentPDFUrl, setCurrentPDFUrl] = useState('')
  const [currentPDFTitle, setCurrentPDFTitle] = useState('')

  // PDF URLs - in a real app, these would come from your database
  const pdfUrls = {
    'monthly-statements': {
      'August 2025': '/documents/example.pdf',
      'July 2025': '/documents/example.pdf',
      'June 2025': '/documents/example.pdf',
      'May 2025': '/documents/example.pdf',
      'April 2025': '/documents/example.pdf',
      'March 2025': '/documents/example.pdf',
      'February 2025': '/documents/example.pdf',
      'January 2025': '/documents/example.pdf'
    },
    'tax-statements': {
      'FORM 1042-S': '/documents/example.pdf',
      'FORM 1099-INT': '/documents/example.pdf',
      'FORM 1099-B': '/documents/example.pdf'
    },
    'trade-confirmations': {
      '2025-08-13-RWT': '/documents/example.pdf'
    },
    'open-order-confirmations': {
      '2025-order-confirm': '/documents/example.pdf'
    }
  }

  // Helper function to open PDF viewer
  const openPDFViewer = (url: string, title: string) => {
    setCurrentPDFUrl(url)
    setCurrentPDFTitle(title)
    setIsPDFViewerOpen(true)
  }

  // Helper function to close PDF viewer
  const closePDFViewer = () => {
    setIsPDFViewerOpen(false)
    setCurrentPDFUrl('')
    setCurrentPDFTitle('')
  }

  // Mock data for monthly statements
  const monthlyStatements = [
    { month: 'August', year: 2025 },
    { month: 'July', year: 2025 },
    { month: 'June', year: 2025 },
    { month: 'May', year: 2025 },
    { month: 'April', year: 2025 },
    { month: 'March', year: 2025 },
    { month: 'February', year: 2025 },
    { month: 'January', year: 2025 },
  ]

  // Mock data for tax statements
  const taxStatements = [
    { name: 'FORM 1042-S' },
    { name: 'FORM 1099-INT' },
    { name: 'FORM 1099-B' },
  ]

  // Mock data for trade confirmations - raw data with dates
  const tradeConfirmationsRaw = [
    { date: '8/13/2025', symbol: 'RWT', cusip: '037833100', description: 'Redwood Trust Inc. - Real Estate Investment Trust', pdfKey: '2025-08-13-RWT' },
    { date: '3/10/2025', symbol: 'MSFT', cusip: '037833100', description: 'Apple Inc. - Technology company specializing in consumer electronics' },
    { date: '2/28/2025', symbol: 'GOOGL', cusip: '037833100', description: 'Amazon.com Inc. - E-commerce and cloud computing company...' },
    { date: '2/25/2025', symbol: 'NVDA', cusip: '037833100', description: 'Vanguard Total Stock Market ETF - Broad market index fund...' },
    { date: '2/25/2025', symbol: 'META', cusip: '037833100', description: '20+ Year Treasury Bond ETF' },
    { date: '2/25/2025', symbol: 'TSLA', cusip: '037833100', description: 'NVIDIA Corporation - Graphics and computing technology...' },
    { date: '2/25/2025', symbol: 'AMD', cusip: '037833100', description: 'Vanguard Real Estate ETF' },
    { date: '2/28/2025', symbol: 'AMZN', cusip: '037833100', description: 'JPMorgan Chase & Co. - Leading global financial services firm' },
    { date: '2/28/2025', symbol: 'INTC', cusip: '037833100', description: 'Meta Platforms Inc. - Social media and technology company' },
    { date: '2/28/2025', symbol: 'CRM', cusip: '037833100', description: 'Invesco QQQ Trust Series 1 - Put Option Contract...' },
    { date: '2/28/2025', symbol: 'ADBE', cusip: '037833100', description: 'iShares Core U.S. Aggregate Bond ETF - Fixed income portfolio' },
    { date: '2/28/2025', symbol: 'ORCL', cusip: '037833100', description: 'Variable Annuity Contract - Balanced growth and income strategy' },
  ]

  // Mock data for open order confirmations - raw data with dates
  const openOrderConfirmationsRaw = [
    { date: '6/9/2025', symbol: 'FXE', cusip: '037833100', description: 'INVESCO CURRENCYSHARES EURO TRUST ETF', pdfKey: '2025-order-confirm' },
    { date: '5/15/2025', symbol: 'AAPL', cusip: '037833100', description: 'Apple Inc.', pdfKey: '2025-order-confirm' },
    { date: '4/20/2025', symbol: 'MSFT', cusip: '037833100', description: 'Microsoft Corporation', pdfKey: '2025-order-confirm' },
  ]

  // Helper function to parse date and group by month/year
  const parseDate = (dateStr: string): Date => {
    const [month, day, year] = dateStr.split('/').map(Number)
    return new Date(year, month - 1, day)
  }

  // Process trade confirmations: generate one row per day in the date range
  const getTradeConfirmationsByDate = () => {
    if (!startDate || !endDate) return []
    
    // Normalize dates to start of day
    const start = new Date(startDate)
    start.setHours(0, 0, 0, 0)
    const end = new Date(endDate)
    end.setHours(0, 0, 0, 0)
    
    // Create a map of dates that have actual data
    const dataMap = new Map<string, { pdfKey?: string }>()
    tradeConfirmationsRaw.forEach(item => {
      const itemDate = parseDate(item.date)
      const dateKey = format(itemDate, 'yyyy-MM-dd')
      if (!dataMap.has(dateKey) && item.pdfKey) {
        dataMap.set(dateKey, { pdfKey: item.pdfKey })
      }
    })
    
    // Generate rows for every day in the range
    const rows: Array<{ date: string, dateObj: Date, description: string, pdfKey?: string }> = []
    const currentDate = new Date(end) // Start from end date (most recent)
    
    while (currentDate >= start) {
      const dateKey = format(currentDate, 'yyyy-MM-dd')
      const data = dataMap.get(dateKey)
      
      rows.push({
        date: format(currentDate, 'MMM d, yyyy'),
        dateObj: new Date(currentDate),
        description: `Trade Confirmations - ${format(currentDate, 'MMMM d, yyyy')}`,
        pdfKey: data?.pdfKey
      })
      
      // Move to previous day
      currentDate.setDate(currentDate.getDate() - 1)
    }
    
    // Apply sorting
    if (tradeConfirmationsSortColumn === 'date') {
      rows.sort((a, b) => {
        const comparison = a.dateObj.getTime() - b.dateObj.getTime()
        return tradeConfirmationsSortDirection === 'asc' ? comparison : -comparison
      })
    }
    
    return rows.map(({ dateObj, ...rest }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      void dateObj; // Used for sorting, but not needed in return
      return rest;
    })
  }

  // Process open order confirmations: generate one row per day in the date range
  const getOpenOrderConfirmationsByDate = () => {
    if (!startDate || !endDate) return []
    
    // Normalize dates to start of day
    const start = new Date(startDate)
    start.setHours(0, 0, 0, 0)
    const end = new Date(endDate)
    end.setHours(0, 0, 0, 0)
    
    // Create a map of dates that have actual data
    const dataMap = new Map<string, { pdfKey?: string }>()
    openOrderConfirmationsRaw.forEach(item => {
      const itemDate = parseDate(item.date)
      const dateKey = format(itemDate, 'yyyy-MM-dd')
      if (!dataMap.has(dateKey) && item.pdfKey) {
        dataMap.set(dateKey, { pdfKey: item.pdfKey })
      }
    })
    
    // Generate rows for every day in the range
    const rows: Array<{ date: string, dateObj: Date, description: string, pdfKey?: string }> = []
    const currentDate = new Date(end) // Start from end date (most recent)
    
    while (currentDate >= start) {
      const dateKey = format(currentDate, 'yyyy-MM-dd')
      const data = dataMap.get(dateKey)
      
      rows.push({
        date: format(currentDate, 'MMM d, yyyy'),
        dateObj: new Date(currentDate),
        description: `Open Order Confirmations - ${format(currentDate, 'MMMM d, yyyy')}`,
        pdfKey: data?.pdfKey
      })
      
      // Move to previous day
      currentDate.setDate(currentDate.getDate() - 1)
    }
    
    // Apply sorting
    if (openOrderConfirmationsSortColumn === 'date') {
      rows.sort((a, b) => {
        const comparison = a.dateObj.getTime() - b.dateObj.getTime()
        return openOrderConfirmationsSortDirection === 'asc' ? comparison : -comparison
      })
    }
    
    return rows.map(({ dateObj, ...rest }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      void dateObj; // Used for sorting, but not needed in return
      return rest;
    })
  }

  // Mock data for shareholder documents
  const shareholderDocuments = [
    { date: '09/03/25', symbol: 'ABALX', cusip: '026349502', issuer: 'Semi-Annual Report', issuerName: 'AMERICAN BALANCED FUND - CLASS A', type: 'Regulatory', dueDate: '', pdfUrl: '/documents/example.pdf' },
  ]

  const tabs = [
    { id: 'monthly-statements', label: 'Monthly statements' },
    { id: 'tax-statements', label: 'Tax statements' },
    { id: 'trade-confirmations', label: 'Trade confirmations' },
    { id: 'open-order-confirmations', label: 'Open order confirmations' },
    { id: 'shareholder-documents', label: 'Shareholder documents' },
    { id: 'quicken', label: 'Quicken' },
  ]

  // Handle Quicken file generation with toast
  const handleGenerateQuicken = async () => {
    const toastId = toast(
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <div>
          <div className="font-medium">Quicken - All Data Export</div>
          <div className="text-sm text-muted-foreground">Preparing...</div>
        </div>
      </div>,
      { duration: Infinity }
    );

    // Simulate preparing phase
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast(
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <div>
          <div className="font-medium">Quicken - All Data Export</div>
          <div className="text-sm text-muted-foreground">Exporting...</div>
        </div>
      </div>,
      { id: toastId, duration: Infinity }
    );

    // Simulate exporting phase
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast(
      <div className="flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-green-500" />
        <div>
          <div className="font-medium">Quicken - All Data Export</div>
          <div className="text-sm text-muted-foreground">Export complete</div>
        </div>
      </div>,
      { id: toastId, duration: 4000 }
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'monthly-statements':
        return (
          <Card className="p-0">
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-20 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" className="h-9">
                  <Download className="w-4 h-4 mr-2" />
                  Download all {selectedYear}
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto px-6 pb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead sortable>
                      Month
                    </TableHead>
                    <TableHead className="text-right">
                      <span>Download/View</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyStatements.map((statement, index) => (
                    <TableRow 
                      key={`${statement.month}-${statement.year}`} 
                      className={`cursor-pointer hover:bg-muted/50 transition-colors ${index % 2 === 1 ? 'bg-card' : ''}`}
                      onClick={() => {
                        const pdfUrl = pdfUrls['monthly-statements'][`${statement.month} ${statement.year}` as keyof typeof pdfUrls['monthly-statements']]
                        if (pdfUrl) {
                          openPDFViewer(pdfUrl, `${statement.month} ${statement.year} Statement`)
                        }
                      }}
                    >
                      <TableCell>
                        {statement.month} {statement.year}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation() // Prevent row click
                              const pdfUrl = pdfUrls['monthly-statements'][`${statement.month} ${statement.year}` as keyof typeof pdfUrls['monthly-statements']]
                              if (pdfUrl) {
                                window.open(pdfUrl, '_blank')
                              }
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation() // Prevent row click
                              const pdfUrl = pdfUrls['monthly-statements'][`${statement.month} ${statement.year}` as keyof typeof pdfUrls['monthly-statements']]
                              if (pdfUrl) {
                                openPDFViewer(pdfUrl, `${statement.month} ${statement.year} Statement`)
                              }
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )

      case 'tax-statements':
        return (
          <Card className="p-0">
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Select value={selectedTaxYear} onValueChange={setSelectedTaxYear}>
                    <SelectTrigger className="w-20 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" className="h-9">
                  <Download className="w-4 h-4 mr-2" />
                  Download all {selectedTaxYear}
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto px-6 pb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <span>Name</span>
                    </TableHead>
                    <TableHead className="text-right">
                      <span>Download/View</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxStatements.map((statement, index) => {
                    const pdfUrl = pdfUrls['tax-statements'][statement.name as keyof typeof pdfUrls['tax-statements']]
                    const hasPDF = !!pdfUrl
                    
                    return (
                      <TableRow 
                        key={statement.name} 
                        className={`${hasPDF ? 'cursor-pointer hover:bg-muted/50 transition-colors' : ''} ${index % 2 === 1 ? 'bg-card' : ''}`}
                        onClick={() => {
                          if (hasPDF && pdfUrl) {
                            openPDFViewer(pdfUrl, `${statement.name} - ${selectedTaxYear}`)
                          }
                        }}
                      >
                        <TableCell>
                          {statement.name}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation() // Prevent row click
                                if (hasPDF && pdfUrl) {
                                  window.open(pdfUrl, '_blank')
                                }
                              }}
                              disabled={!hasPDF}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation() // Prevent row click
                                if (hasPDF && pdfUrl) {
                                  openPDFViewer(pdfUrl, `${statement.name} - ${selectedTaxYear}`)
                                }
                              }}
                              disabled={!hasPDF}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        )

      case 'trade-confirmations':
        const tradeConfirmations = getTradeConfirmationsByDate()
        return (
          <Card className="p-0">
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-muted-foreground">Start date</label>
                    <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-36 h-9 justify-start text-left font-normal ${
                            !startDate && "text-muted-foreground"
                          }`}
                        >
                          {startDate ? format(startDate, "MMM d, yyyy") : <span>Pick a date</span>}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="!w-fit min-w-[280px] p-0" align="start">
                        <div className="p-4 pb-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">Select a date</h3>
                            <button
                              onClick={() => setStartDateOpen(false)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              aria-label="Close"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <CalendarComponent
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => {
                            setStartDate(date)
                            setStartDateOpen(false)
                          }}
                          captionLayout="dropdown"
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-muted-foreground">End date</label>
                    <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-36 h-9 justify-start text-left font-normal ${
                            !endDate && "text-muted-foreground"
                          }`}
                        >
                          {endDate ? format(endDate, "MMM d, yyyy") : <span>Pick a date</span>}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="!w-fit min-w-[280px] p-0" align="start">
                        <div className="p-4 pb-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">Select a date</h3>
                            <button
                              onClick={() => setEndDateOpen(false)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              aria-label="Close"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <CalendarComponent
                          mode="single"
                          selected={endDate}
                          onSelect={(date) => {
                            setEndDate(date)
                            setEndDateOpen(false)
                          }}
                          captionLayout="dropdown"
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <Button variant="outline" className="h-9">
                  <Download className="w-4 h-4 mr-2" />
                  Download all
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto px-6 pb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer hover:bg-muted/50">
                      <button 
                        className="flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (tradeConfirmationsSortColumn === 'date') {
                            setTradeConfirmationsSortDirection(tradeConfirmationsSortDirection === 'asc' ? 'desc' : 'asc')
                          } else {
                            setTradeConfirmationsSortColumn('date')
                            setTradeConfirmationsSortDirection('desc')
                          }
                        }}
                      >
                        <span>Date</span>
                        {tradeConfirmationsSortColumn === 'date' ? (
                          tradeConfirmationsSortDirection === 'asc' ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                        )}
                      </button>
                    </TableHead>
                    <TableHead className="text-right">
                      <span>Download/view</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tradeConfirmations.map((confirmation, index) => {
                    const pdfUrl = '/documents/example.pdf'
                    return (
                      <TableRow 
                        key={confirmation.date} 
                        className={`cursor-pointer hover:bg-muted/50 transition-colors ${index % 2 === 1 ? 'bg-card' : ''}`}
                        onClick={() => {
                          openPDFViewer(pdfUrl, confirmation.description)
                        }}
                      >
                        <TableCell>
                          {confirmation.date}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation() // Prevent row click
                                window.open(pdfUrl, '_blank')
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation() // Prevent row click
                                openPDFViewer(pdfUrl, confirmation.description)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        )

      case 'open-order-confirmations':
        const openOrderConfirmations = getOpenOrderConfirmationsByDate()
        return (
          <Card className="p-0">
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-muted-foreground">Start date</label>
                    <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-36 h-9 justify-start text-left font-normal ${
                            !startDate && "text-muted-foreground"
                          }`}
                        >
                          {startDate ? format(startDate, "MMM d, yyyy") : <span>Pick a date</span>}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="!w-fit min-w-[280px] p-0" align="start">
                        <div className="p-4 pb-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">Select a date</h3>
                            <button
                              onClick={() => setStartDateOpen(false)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              aria-label="Close"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <CalendarComponent
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => {
                            setStartDate(date)
                            setStartDateOpen(false)
                          }}
                          captionLayout="dropdown"
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-muted-foreground">End date</label>
                    <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-36 h-9 justify-start text-left font-normal ${
                            !endDate && "text-muted-foreground"
                          }`}
                        >
                          {endDate ? format(endDate, "MMM d, yyyy") : <span>Pick a date</span>}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="!w-fit min-w-[280px] p-0" align="start">
                        <div className="p-4 pb-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">Select a date</h3>
                            <button
                              onClick={() => setEndDateOpen(false)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              aria-label="Close"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <CalendarComponent
                          mode="single"
                          selected={endDate}
                          onSelect={(date) => {
                            setEndDate(date)
                            setEndDateOpen(false)
                          }}
                          captionLayout="dropdown"
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <Button variant="outline" className="h-9">
                  <Download className="w-4 h-4 mr-2" />
                  Download all
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto px-6 pb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer hover:bg-muted/50">
                      <button 
                        className="flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (openOrderConfirmationsSortColumn === 'date') {
                            setOpenOrderConfirmationsSortDirection(openOrderConfirmationsSortDirection === 'asc' ? 'desc' : 'asc')
                          } else {
                            setOpenOrderConfirmationsSortColumn('date')
                            setOpenOrderConfirmationsSortDirection('desc')
                          }
                        }}
                      >
                        <span>Date</span>
                        {openOrderConfirmationsSortColumn === 'date' ? (
                          openOrderConfirmationsSortDirection === 'asc' ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                        )}
                      </button>
                    </TableHead>
                    <TableHead className="text-right">
                      <span>Download/view</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {openOrderConfirmations.map((confirmation, index) => {
                    const pdfUrl = '/documents/example.pdf'
                    return (
                      <TableRow 
                        key={confirmation.date} 
                        className={`cursor-pointer hover:bg-muted/50 transition-colors ${index % 2 === 1 ? 'bg-card' : ''}`}
                        onClick={() => {
                          openPDFViewer(pdfUrl, confirmation.description)
                        }}
                      >
                        <TableCell>
                          {confirmation.date}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation() // Prevent row click
                                window.open(pdfUrl, '_blank')
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation() // Prevent row click
                                openPDFViewer(pdfUrl, confirmation.description)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        )

      case 'shareholder-documents':
        return (
          <Card className="p-0">
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by Symbol or CUSIP"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64 h-9"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto px-6 pb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead sortable>
                      Date
                    </TableHead>
                    <TableHead sortable>
                      Symbol/CUSIP
                    </TableHead>
                    <TableHead sortable>
                      Issuer
                    </TableHead>
                    <TableHead sortable>
                      Type
                    </TableHead>
                    <TableHead sortable>
                      Due date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shareholderDocuments.map((document, index) => (
                    <TableRow key={`${document.date}-${document.symbol}`} className={`${index % 2 === 1 ? 'bg-card' : ''}`}>
                      <TableCell>
                        {document.date}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{document.symbol}</div>
                          <div className="text-xs text-muted-foreground">{document.cusip}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-1">
                            <a 
                              href={document.pdfUrl || "#"} 
                              className="text-primary hover:underline flex items-center gap-1 cursor-pointer"
                              onClick={(e) => {
                                if (document.pdfUrl) {
                                  e.preventDefault();
                                  openPDFViewer(document.pdfUrl, `${document.issuer} - ${document.issuerName}`);
                                }
                              }}
                            >
                              {document.issuer}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                          <div className="text-xs text-muted-foreground">{document.issuerName}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {document.type}
                      </TableCell>
                      <TableCell>
                        {document.dueDate || ''}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )

      case 'quicken':
        return (
          <Card className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-2">Quicken data export</h3>
                <p className="text-muted-foreground mb-6">Choose a date range and download a .qfx file for Quicken to analyze your finances and track your net worth.</p>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-muted-foreground">Start date</label>
                    <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-36 h-9 justify-start text-left font-normal ${
                            !startDate && "text-muted-foreground"
                          }`}
                        >
                          {startDate ? format(startDate, "MMM d, yyyy") : <span>Pick a date</span>}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="!w-fit min-w-[280px] p-0" align="start">
                        <div className="p-4 pb-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">Select a date</h3>
                            <button
                              onClick={() => setStartDateOpen(false)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              aria-label="Close"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <CalendarComponent
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => {
                            setStartDate(date)
                            setStartDateOpen(false)
                          }}
                          captionLayout="dropdown"
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-muted-foreground">End date</label>
                    <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-36 h-9 justify-start text-left font-normal ${
                            !endDate && "text-muted-foreground"
                          }`}
                        >
                          {endDate ? format(endDate, "MMM d, yyyy") : <span>Pick a date</span>}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="!w-fit min-w-[280px] p-0" align="start">
                        <div className="p-4 pb-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">Select a date</h3>
                            <button
                              onClick={() => setEndDateOpen(false)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              aria-label="Close"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <CalendarComponent
                          mode="single"
                          selected={endDate}
                          onSelect={(date) => {
                            setEndDate(date)
                            setEndDateOpen(false)
                          }}
                          captionLayout="dropdown"
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-muted-foreground invisible">Action</label>
                    <Button className="bg-primary hover:bg-primary/90" onClick={handleGenerateQuicken}>
                      Generate Quicken file
                  </Button>
                  </div>
                </div>
              </div>
              <div className="ml-8">
                <Image 
                  src="/images/quicken.svg" 
                  alt="Quicken" 
                  width={192}
                  height={192}
                  className="object-contain"
                />
              </div>
            </div>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium font-serif text-slate-900 dark:text-slate-100">Documents</h1>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`pb-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>

      {/* PDF Viewer Modal */}
      <PDFViewer
        isOpen={isPDFViewerOpen}
        onClose={closePDFViewer}
        pdfUrl={currentPDFUrl}
        title={currentPDFTitle}
      />
    </div>
  )
}
