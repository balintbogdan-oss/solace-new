'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { ArrowLeftRight, Calendar, History, Send } from 'lucide-react'
import { useAccountData } from '@/contexts/AccountDataContext'
import { cn } from '@/lib/utils'

// Mock accounts for transfer dropdowns (in real app, load from API)
const MOCK_ACCOUNTS = [
  { id: 'account-1', name: 'Individual Brokerage', suffix: '3847', balance: 158247.83 },
  { id: 'account-2', name: 'IRA Traditional', suffix: '2912', balance: 89234.56 },
  { id: 'account-3', name: 'Joint Account', suffix: '1002', balance: 245100.00 },
  { id: 'external', name: 'External bank', suffix: '•••4521', balance: null },
]

interface TransferRecord {
  id: string
  date: string
  from: string
  to: string
  amount: number
  status: 'completed' | 'pending' | 'scheduled' | 'cancelled'
  memo?: string
  scheduledDate?: string
}

const MOCK_RECENT_TRANSFERS: TransferRecord[] = [
  { id: '1', date: '2025-02-18', from: 'Individual ...3847', to: 'IRA ...2912', amount: 2000, status: 'completed', memo: 'Monthly IRA contribution' },
  { id: '2', date: '2025-02-15', from: 'Individual ...3847', to: 'External ...4521', amount: 1500, status: 'completed' },
  { id: '3', date: '2025-02-20', from: 'IRA ...2912', to: 'Individual ...3847', amount: 500, status: 'pending' },
  { id: '4', date: '2025-02-25', from: 'Individual ...3847', to: 'Joint ...1002', amount: 3000, status: 'scheduled', scheduledDate: '2025-02-25' },
]

export default function MoveMoneyPage() {
  const params = useParams()
  const accountId = (params?.accountId as string) || ''
  const { data: accountData } = useAccountData()

  const [activeTab, setActiveTab] = useState<'transfer' | 'scheduled'>('transfer')
  const [fromAccount, setFromAccount] = useState(accountId || MOCK_ACCOUNTS[0].id)
  const [toAccount, setToAccount] = useState(MOCK_ACCOUNTS[1].id)
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')
  const [scheduleForLater, setScheduleForLater] = useState(false)
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recentTransfers, setRecentTransfers] = useState<TransferRecord[]>(MOCK_RECENT_TRANSFERS)

  const availableAccounts = MOCK_ACCOUNTS.filter((a) => a.id !== fromAccount)
  const toAccountOptions = fromAccount === 'external' ? MOCK_ACCOUNTS : availableAccounts

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) return
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 800))
    const from = MOCK_ACCOUNTS.find((a) => a.id === fromAccount)
    const to = MOCK_ACCOUNTS.find((a) => a.id === toAccount)
    setRecentTransfers((prev) => [
      {
        id: String(Date.now()),
        date: format(new Date(), 'yyyy-MM-dd'),
        from: from ? `${from.name} ...${from.suffix}` : 'Unknown',
        to: to ? `${to.name} ...${to.suffix}` : 'Unknown',
        amount: parseFloat(amount),
        status: scheduleForLater ? 'scheduled' : 'pending',
        memo: memo || undefined,
        scheduledDate: scheduleForLater && scheduledDate ? format(scheduledDate, 'yyyy-MM-dd') : undefined,
      },
      ...prev,
    ])
    setAmount('')
    setMemo('')
    setScheduledDate(undefined)
    setScheduleForLater(false)
    setIsSubmitting(false)
  }

  const scheduledList = recentTransfers.filter((t) => t.status === 'scheduled')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <ArrowLeftRight className="h-6 w-6 text-[#B8860B]" />
          Move money
        </h1>
        <p className="text-muted-foreground mt-1">
          Transfer between your accounts or to an external bank.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'transfer' | 'scheduled')}>
        <TabsList className="w-fit">
          <TabsTrigger value="transfer">Transfer</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled transfers</TabsTrigger>
        </TabsList>

        <TabsContent value="transfer" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">New transfer</CardTitle>
              <CardDescription>Move funds from one account to another.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="from" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">From account</label>
                    <Select value={fromAccount} onValueChange={setFromAccount}>
                      <SelectTrigger id="from">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_ACCOUNTS.map((acc) => (
                          <SelectItem key={acc.id} value={acc.id}>
                            <span className="flex items-center justify-between gap-4">
                              {acc.name} ...{acc.suffix}
                              {acc.balance != null && (
                                <span className="text-muted-foreground text-xs">
                                  {formatCurrency(acc.balance)}
                                </span>
                              )}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="to" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">To account</label>
                    <Select value={toAccount} onValueChange={setToAccount}>
                      <SelectTrigger id="to">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {toAccountOptions.map((acc) => (
                          <SelectItem key={acc.id} value={acc.id}>
                            {acc.name} ...{acc.suffix}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="amount" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Amount (USD)</label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="max-w-xs"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="memo" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Memo (optional)</label>
                  <Input
                    id="memo"
                    placeholder="e.g. Monthly savings"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="schedule"
                      checked={scheduleForLater}
                      onCheckedChange={(checked) => setScheduleForLater(checked === true)}
                    />
                    <label htmlFor="schedule" className="text-sm font-normal cursor-pointer">
                      Schedule for later
                    </label>
                  </div>
                  {scheduleForLater && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full sm:w-auto justify-start text-left font-normal',
                            !scheduledDate && 'text-muted-foreground'
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {scheduledDate ? format(scheduledDate, 'PPP') : 'Pick date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={scheduledDate}
                          onSelect={setScheduledDate}
                          disabled={(date) => date <= new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </div>

                <Button type="submit" disabled={isSubmitting || !amount || parseFloat(amount) <= 0}>
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Submitting…' : scheduleForLater ? 'Schedule transfer' : 'Transfer now'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent transfers
              </CardTitle>
              <CardDescription>Your latest money movement activity.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">From</th>
                      <th className="text-left py-3 px-4 font-medium">To</th>
                      <th className="text-right py-3 px-4 font-medium">Amount</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransfers
                      .filter((t) => t.status !== 'scheduled')
                      .slice(0, 10)
                      .map((row) => (
                        <tr key={row.id} className="border-b last:border-0">
                          <td className="py-3 px-4">{row.date}</td>
                          <td className="py-3 px-4">{row.from}</td>
                          <td className="py-3 px-4">{row.to}</td>
                          <td className="py-3 px-4 text-right font-medium">{formatCurrency(row.amount)}</td>
                          <td className="py-3 px-4">
                            <span
                              className={cn(
                                'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                                row.status === 'completed' && 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                                row.status === 'pending' && 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
                                row.status === 'cancelled' && 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                              )}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Scheduled transfers</CardTitle>
              <CardDescription>Transfers that are set to run on a future date.</CardDescription>
            </CardHeader>
            <CardContent>
              {scheduledList.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">No scheduled transfers.</p>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left py-3 px-4 font-medium">Scheduled date</th>
                        <th className="text-left py-3 px-4 font-medium">From</th>
                        <th className="text-left py-3 px-4 font-medium">To</th>
                        <th className="text-right py-3 px-4 font-medium">Amount</th>
                        <th className="text-left py-3 px-4 font-medium">Memo</th>
                        <th className="text-right py-3 px-4 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduledList.map((row) => (
                        <tr key={row.id} className="border-b last:border-0">
                          <td className="py-3 px-4">{row.scheduledDate || row.date}</td>
                          <td className="py-3 px-4">{row.from}</td>
                          <td className="py-3 px-4">{row.to}</td>
                          <td className="py-3 px-4 text-right font-medium">{formatCurrency(row.amount)}</td>
                          <td className="py-3 px-4 text-muted-foreground">{row.memo || '—'}</td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              Cancel
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
