'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Download, Eye, ChevronDown, Search, Calendar, ExternalLink } from 'lucide-react'

type TabType = 'monthly-statements' | 'tax-statements' | 'trade-confirmations' | 'open-order-confirmations' | 'shareholder-documents' | 'quickdirect'

export default function StatementsReportsPage() {
  const [selectedYear, setSelectedYear] = useState('2025')
  const [selectedTaxYear, setSelectedTaxYear] = useState('2024')
  const [activeTab, setActiveTab] = useState<TabType>('monthly-statements')
  const [searchTerm, setSearchTerm] = useState('')
  const [startDate, setStartDate] = useState<Date | undefined>(new Date('2025-01-01'))
  const [endDate, setEndDate] = useState<Date | undefined>(new Date('2025-06-06'))
  
  // PDF Viewer state
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false)
  const [currentPDFUrl, setCurrentPDFUrl] = useState('')
  const [currentPDFTitle, setCurrentPDFTitle] = useState('')

  // PDF URLs - in a real app, these would come from your database
  const pdfUrls = {
    'monthly-statements': {
      'August 2025': 'https://fflfwtoljxmgjwpekkxv.supabase.co/storage/v1/object/sign/documents/1PB20025/monthly-statements/2025/2025-08-statement.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83ZTJkNGQ2Ny03MTI5LTRmZDUtOWEzMS05ZDQzYWZlY2FkYzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJkb2N1bWVudHMvMVBCMjAwMjUvbW9udGhseS1zdGF0ZW1lbnRzLzIwMjUvMjAyNS0wOC1zdGF0ZW1lbnQucGRmIiwiaWF0IjoxNzU3NzgzMDI3LCJleHAiOjE3ODkzMTkwMjd9.26Jj13-wVCefiKeBFYy2c19oXWhtcVeV28ELsWnQl-A'
    },
    'tax-statements': {
      'FORM 1042-S': 'https://fflfwtoljxmgjwpekkxv.supabase.co/storage/v1/object/sign/documents/1PB20025/tax-documents/2024/1042-s-2024.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83ZTJkNGQ2Ny03MTI5LTRmZDUtOWEzMS05ZDQzYWZlY2FkYzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJkb2N1bWVudHMvMVBCMjAwMjUvdGF4LWRvY3VtZW50cy8yMDI0LzEwNDItcy0yMDI0LnBkZiIsImlhdCI6MTc1Nzc4OTYzNCwiZXhwIjoxNzg5MzI1NjM0fQ.NWvw5tKIPpoqhVldw9_-O_WsDN_8zp3lJt5ThivDpbA',
      'FORM 1099-INT': 'https://example.com/tax-documents/form-1099-int.pdf',
      'FORM 1099-B': 'https://example.com/tax-documents/form-1099-b.pdf'
    },
    'trade-confirmations': {
      '2025-08-13-RWT': 'https://fflfwtoljxmgjwpekkxv.supabase.co/storage/v1/object/sign/documents/1PB20025/trade-confirmations/2025/2025-08-13-RWT-confirmation.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83ZTJkNGQ2Ny03MTI5LTRmZDUtOWEzMS05ZDQzYWZlY2FkYzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJkb2N1bWVudHMvMVBCMjAwMjUvdHJhZGUtY29uZmlybWF0aW9ucy8yMDI1LzIwMjUtMDgtMTMtUldULWNvbmZpcm1hdGlvbi5wZGYiLCJpYXQiOjE3NTc3ODk4MzEsImV4cCI6MTc4OTMyNTgzMX0.CBSqDBBTqsHvQlIfhgbUjR-ios5RDRyFVII9-VS8NYY'
    },
    'open-order-confirmations': {
      '2025-order-confirm': 'https://fflfwtoljxmgjwpekkxv.supabase.co/storage/v1/object/sign/documents/1PB20025/order-confirmations/2025/order_confirm_display.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83ZTJkNGQ2Ny03MTI5LTRmZDUtOWEzMS05ZDQzYWZlY2FkYzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJkb2N1bWVudHMvMVBCMjAwMjUvb3JkZXItY29uZmlybWF0aW9ucy8yMDI1L29yZGVyX2NvbmZpcm1fZGlzcGxheS5wZGYiLCJpYXQiOjE3NTc3ODk5NjgsImV4cCI6MTc4OTMyNTk2OH0.fyHBWimltjCG4JVj1K3hxORF5KPHPGpjbWlRfH_HGxg'
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

  // Mock data for trade confirmations
  const tradeConfirmations = [
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

  // Mock data for open order confirmations
  const openOrderConfirmations = [
    { date: '8/15/2025', symbol: 'ORDER', cusip: '037833100', description: 'Order Confirmation Display - General order confirmation document', pdfKey: '2025-order-confirm' },
    { date: '3/10/2025', symbol: 'MSFT', cusip: '037833100', description: 'Apple Inc. - Technology company specializing in consumer electronics' },
    { date: '2/28/2025', symbol: 'GOOGL', cusip: '037833100', description: 'Amazon.com Inc. - E-commerce and cloud computing company...' },
    { date: '2/25/2025', symbol: 'NVDA', cusip: '037833100', description: 'Vanguard Total Stock Market ETF - Broad market index fund...' },
  ]

  // Mock data for shareholder documents
  const shareholderDocuments = [
    { date: '12/15/2023', symbol: 'AAPL', cusip: '037833100', issuer: 'Section 19a', issuerName: 'DOUBLELINE YIELD OPPORTUNITIES FUND', type: 'Annual Meeting', dueDate: '12/15/2023' },
    { date: '11/28/2023', symbol: 'TLT', cusip: '037833100', issuer: 'Section 19a', issuerName: 'NUVEEN VARIABLE RATE PREFERRED & INCOME', type: 'Regulatory', dueDate: '' },
    { date: '10/15/2023', symbol: 'AMD', cusip: '037833100', issuer: 'Proxy Statement', issuerName: 'ABRDN GLOBAL INFRASTRUCTURE INC FD', type: 'Regulatory', dueDate: '10/15/2023' },
    { date: '9/22/2023', symbol: 'META', cusip: '037833100', issuer: 'Section 19a', issuerName: 'CASH RESERVES FEDERAL MONEY MARKET -ADM', type: 'Regulatory', dueDate: '' },
    { date: '8/30/2023', symbol: 'AMZN', cusip: '037833100', issuer: 'Section 19a', issuerName: 'DOUBLELINE YIELD OPPORTUNITIES FUND', type: 'Annual Meeting', dueDate: '' },
    { date: '7/15/2023', symbol: 'ADBE', cusip: '037833100', issuer: 'Section 19a', issuerName: 'NUVEEN VARIABLE RATE PREFERRED & INCOME', type: 'Annual Meeting', dueDate: '' },
    { date: '8/30/2023', symbol: 'INTC', cusip: '037833100', issuer: 'Section 19a', issuerName: 'DOUBLELINE YIELD OPPORTUNITIES FUND', type: 'Regulatory', dueDate: '8/30/2023' },
    { date: '7/15/2023', symbol: 'VNQ', cusip: '037833100', issuer: 'Section 19a', issuerName: 'NUVEEN VARIABLE RATE PREFERRED & INCOME', type: 'Annual Meeting', dueDate: '' },
    { date: '8/30/2023', symbol: 'CRM', cusip: '037833100', issuer: 'Section 19a', issuerName: 'DOUBLELINE YIELD OPPORTUNITIES FUND', type: 'Annual Meeting', dueDate: '' },
    { date: '7/15/2023', symbol: 'ORCL', cusip: '037833100', issuer: 'Section 19a', issuerName: 'NUVEEN VARIABLE RATE PREFERRED & INCOME', type: 'Regulatory', dueDate: '' },
    { date: '8/30/2023', symbol: 'MSFT', cusip: '037833100', issuer: 'Section 19a', issuerName: 'DOUBLELINE YIELD OPPORTUNITIES FUND', type: 'Regulatory', dueDate: '8/30/2023' },
  ]

  const tabs = [
    { id: 'monthly-statements', label: 'Monthly statements' },
    { id: 'tax-statements', label: 'Tax statements' },
    { id: 'trade-confirmations', label: 'Trade confirmations' },
    { id: 'open-order-confirmations', label: 'Open order confirmations' },
    { id: 'shareholder-documents', label: 'Shareholder documents' },
    { id: 'quickdirect', label: 'QuickDirect' },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'monthly-statements':
        return (
          <>
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

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50">
                      <button className="flex items-center gap-1 w-full">
                        <span className="text-xs">Month</span>
                        <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      </button>
                    </th>
                    <th className="text-right px-6 py-3 font-medium text-muted-foreground whitespace-nowrap">
                      <span className="text-xs">Download/View</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyStatements.map((statement, index) => (
                    <tr 
                      key={`${statement.month}-${statement.year}`} 
                      className={`border-b cursor-pointer hover:bg-muted/50 transition-colors ${index % 2 === 1 ? 'bg-card' : ''}`}
                      onClick={() => {
                        const pdfUrl = pdfUrls['monthly-statements'][`${statement.month} ${statement.year}` as keyof typeof pdfUrls['monthly-statements']]
                        if (pdfUrl) {
                          openPDFViewer(pdfUrl, `${statement.month} ${statement.year} Statement`)
                        }
                      }}
                    >
                      <td className="px-6 py-3 text-foreground">
                        {statement.month} {statement.year}
                      </td>
                      <td className="px-6 py-3 text-right">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )

      case 'tax-statements':
        return (
          <>
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

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left px-6 py-3 font-medium text-muted-foreground whitespace-nowrap">
                      <span className="text-xs">Name</span>
                    </th>
                    <th className="text-right px-6 py-3 font-medium text-muted-foreground whitespace-nowrap">
                      <span className="text-xs">Download/View</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {taxStatements.map((statement, index) => {
                    const pdfUrl = pdfUrls['tax-statements'][statement.name as keyof typeof pdfUrls['tax-statements']]
                    const hasPDF = pdfUrl && !pdfUrl.includes('example.com')
                    
                    return (
                      <tr 
                        key={statement.name} 
                        className={`border-b ${hasPDF ? 'cursor-pointer hover:bg-muted/50 transition-colors' : ''} ${index % 2 === 1 ? 'bg-card' : ''}`}
                        onClick={() => {
                          if (hasPDF) {
                            openPDFViewer(pdfUrl, `${statement.name} - ${selectedTaxYear}`)
                          }
                        }}
                      >
                        <td className="px-6 py-3 text-foreground">
                          {statement.name}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation() // Prevent row click
                                if (hasPDF) {
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
                                if (hasPDF) {
                                  openPDFViewer(pdfUrl, `${statement.name} - ${selectedTaxYear}`)
                                }
                              }}
                              disabled={!hasPDF}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )

      case 'trade-confirmations':
        return (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Input value={startDate ? format(startDate, 'MMM d, yyyy') : ''} readOnly className="w-32 h-9" />
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2">
                  <Input value={endDate ? format(endDate, 'MMM d, yyyy') : ''} readOnly className="w-32 h-9" />
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
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
              <Button variant="outline" className="h-9">
                <Download className="w-4 h-4 mr-2" />
                Download all
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50">
                      <button className="flex items-center gap-1 w-full">
                        <span className="text-xs">Date</span>
                        <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      </button>
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50">
                      <button className="flex items-center gap-1 w-full">
                        <span className="text-xs">Symbol</span>
                        <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      </button>
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50">
                      <button className="flex items-center gap-1 w-full">
                        <span className="text-xs">Description</span>
                        <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      </button>
                    </th>
                    <th className="text-right px-6 py-3 font-medium text-muted-foreground whitespace-nowrap">
                      <span className="text-xs">Download/View</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tradeConfirmations.map((confirmation, index) => {
                    const pdfUrl = confirmation.pdfKey ? pdfUrls['trade-confirmations'][confirmation.pdfKey as keyof typeof pdfUrls['trade-confirmations']] : null
                    return (
                      <tr 
                        key={`${confirmation.date}-${confirmation.symbol}`} 
                        className={`border-b cursor-pointer hover:bg-muted/50 transition-colors ${index % 2 === 1 ? 'bg-card' : ''}`}
                        onClick={() => {
                          if (pdfUrl) {
                            openPDFViewer(pdfUrl, `Trade Confirmation - ${confirmation.symbol} - ${confirmation.date}`)
                          }
                        }}
                      >
                        <td className="px-6 py-3 text-foreground">
                          {confirmation.date}
                        </td>
                        <td className="px-6 py-3 text-foreground">
                          <div>
                            <div className="font-medium">{confirmation.symbol}</div>
                            <div className="text-xs text-muted-foreground">{confirmation.cusip}</div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-foreground">
                          {confirmation.description}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation() // Prevent row click
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
                                if (pdfUrl) {
                                  openPDFViewer(pdfUrl, `Trade Confirmation - ${confirmation.symbol} - ${confirmation.date}`)
                                }
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )

      case 'open-order-confirmations':
        return (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Input value={startDate ? format(startDate, 'MMM d, yyyy') : ''} readOnly className="w-32 h-9" />
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2">
                  <Input value={endDate ? format(endDate, 'MMM d, yyyy') : ''} readOnly className="w-32 h-9" />
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
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
              <Button variant="outline" className="h-9">
                <Download className="w-4 h-4 mr-2" />
                Download all
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50">
                      <button className="flex items-center gap-1 w-full">
                        <span className="text-xs">Date</span>
                        <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      </button>
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50">
                      <button className="flex items-center gap-1 w-full">
                        <span className="text-xs">Symbol</span>
                        <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      </button>
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50">
                      <button className="flex items-center gap-1 w-full">
                        <span className="text-xs">Description</span>
                        <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      </button>
                    </th>
                    <th className="text-right px-6 py-3 font-medium text-muted-foreground whitespace-nowrap">
                      <span className="text-xs">Download/View</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {openOrderConfirmations.map((confirmation, index) => {
                    const pdfUrl = confirmation.pdfKey ? pdfUrls['open-order-confirmations'][confirmation.pdfKey as keyof typeof pdfUrls['open-order-confirmations']] : null
                    return (
                      <tr 
                        key={`${confirmation.date}-${confirmation.symbol}`} 
                        className={`border-b cursor-pointer hover:bg-muted/50 transition-colors ${index % 2 === 1 ? 'bg-card' : ''}`}
                        onClick={() => {
                          if (pdfUrl) {
                            openPDFViewer(pdfUrl, `Order Confirmation - ${confirmation.symbol} - ${confirmation.date}`)
                          }
                        }}
                      >
                        <td className="px-6 py-3 text-foreground">
                          {confirmation.date}
                        </td>
                        <td className="px-6 py-3 text-foreground">
                          <div>
                            <div className="font-medium">{confirmation.symbol}</div>
                            <div className="text-xs text-muted-foreground">{confirmation.cusip}</div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-foreground">
                          {confirmation.description}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation() // Prevent row click
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
                                if (pdfUrl) {
                                  openPDFViewer(pdfUrl, `Order Confirmation - ${confirmation.symbol} - ${confirmation.date}`)
                                }
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )

      case 'shareholder-documents':
        return (
          <>
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

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50">
                      <button className="flex items-center gap-1 w-full">
                        <span className="text-xs">Date</span>
                        <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      </button>
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50">
                      <button className="flex items-center gap-1 w-full">
                        <span className="text-xs">Symbol/CUSIP</span>
                        <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      </button>
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50">
                      <button className="flex items-center gap-1 w-full">
                        <span className="text-xs">Issuer</span>
                        <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      </button>
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50">
                      <button className="flex items-center gap-1 w-full">
                        <span className="text-xs">Type</span>
                        <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      </button>
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50">
                      <button className="flex items-center gap-1 w-full">
                        <span className="text-xs">Action</span>
                        <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      </button>
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50">
                      <button className="flex items-center gap-1 w-full">
                        <span className="text-xs">Due date</span>
                        <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shareholderDocuments.map((document, index) => (
                    <tr key={`${document.date}-${document.symbol}`} className={`border-b ${index % 2 === 1 ? 'bg-card' : ''}`}>
                      <td className="px-6 py-3 text-foreground">
                        {document.date}
                      </td>
                      <td className="px-6 py-3 text-foreground">
                        <div>
                          <div className="font-medium">{document.symbol}</div>
                          <div className="text-xs text-muted-foreground">{document.cusip}</div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-foreground">
                        <div>
                          <div className="flex items-center gap-1">
                            <a href="#" className="text-primary hover:underline flex items-center gap-1">
                              {document.issuer}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                          <div className="text-xs text-muted-foreground">{document.issuerName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-foreground">
                        {document.type}
                      </td>
                      <td className="px-6 py-3 text-foreground">
                        Placeholder
                      </td>
                      <td className="px-6 py-3 text-foreground">
                        {document.dueDate || ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )

      case 'quickdirect':
        return (
          <div className="bg-white dark:bg-card rounded-lg p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-2">Generate Quicken export file</h3>
                <p className="text-muted-foreground mb-6">Export your latest financial data for import into Quicken (.qfx format)</p>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Start date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-32 h-9 justify-start text-left font-normal ${
                            !startDate && "text-muted-foreground"
                          }`}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "MMM d, yyyy") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">End date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-32 h-9 justify-start text-left font-normal ${
                            !endDate && "text-muted-foreground"
                          }`}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "MMM d, yyyy") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">
                    Generate Quicken File
                  </Button>
                </div>
              </div>
              <div className="ml-8">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-400">Q</span>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-7">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center pb-2">
            <h1 className="text-3xl font-medium font-serif text-slate-900 dark:text-slate-100">Documents</h1>
          </div>
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
