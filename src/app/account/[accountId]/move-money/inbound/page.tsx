'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
  CalendarDays,
  ChevronLeft,
  Landmark,
  Plus,
  User,
} from 'lucide-react'
import { HeaderMoneyMovement } from '@/components/layout/HeaderMoneyMovement'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const FUNDS_AVAILABLE = 23_422_112

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(cents / 100)
}

function parseCentsFromInput(raw: string): number {
  const digits = raw.replace(/\D/g, '')
  return digits ? parseInt(digits, 10) : 0
}

const ACCOUNT_OPTIONS = [
  { id: '35337168', type: 'Joint', owner: 'Jim & Alexa Robinson' },
  { id: '26119004', type: 'Individual', owner: 'Jim Robinson' },
]

const ACH_COLUMNS = ['ABA number', 'Account type', 'Account number', 'Account name']
const ACH_ROWS = [
  { id: '1', cells: ['12345612312', 'Checking', '12415258166', 'Jim Robinson'] },
  { id: '2', cells: ['12345612312', 'Checking', '12415258166', 'Alexa Robinson'] },
]

export default function InboundDisbursementPage() {
  const router = useRouter()
  const params = useParams()
  const accountId = params?.accountId as string

  const moveMoneyPath = `/account/${accountId}/move-money`
  const instructionsPath = `/account/${accountId}/move-money/inbound/instructions`

  const [selectedAccountId, setSelectedAccountId] = useState(ACCOUNT_OPTIONS[0].id)
  const selectedAccount = ACCOUNT_OPTIONS.find((a) => a.id === selectedAccountId) ?? ACCOUNT_OPTIONS[0]
  const [amountCents, setAmountCents] = useState(0)
  const [distributionDate, setDistributionDate] = useState<Date>(new Date(2025, 4, 5))
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState(ACH_ROWS[0].id)
  const inputRef = useRef<HTMLInputElement>(null)

  const amountDollars = amountCents / 100
  const exceedsFunds = amountDollars > FUNDS_AVAILABLE / 100
  const isEmpty = amountCents === 0

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const cents = parseCentsFromInput(e.target.value)
    if (cents > 99999999999) return
    setAmountCents(cents)
  }, [])

  const handleAmountKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      e.preventDefault()
    }
  }, [])

  return (
    <div className="fixed inset-0 z-20 flex flex-col bg-white">
      <HeaderMoneyMovement />

      <main className="flex flex-1 justify-center overflow-y-auto px-4 py-10">
        <div className="w-full max-w-[700px] space-y-8 pb-10">
          {/* Step title */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Step 1 of 3</p>
            <h1 className="font-serif text-[28px] font-medium leading-[48px] tracking-tight text-foreground">
              Inbound disbursement
            </h1>
          </div>

          {/* Transfer from */}
          <section className="space-y-3">
            <h2 className="font-serif text-[20px] font-medium leading-8 text-foreground">
              Transfer from
            </h2>

            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Client</p>
              <div className="flex h-10 items-center gap-3 rounded-md px-2.5">
                <Avatar className="size-7 shrink-0 rounded-full bg-chart-6">
                  <AvatarFallback className="bg-chart-6 text-black">
                    <User className="size-4" strokeWidth={2} />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold text-foreground">
                  Jim Robinson
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Account</p>
              <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                <SelectTrigger className="h-10 w-full border-input bg-white px-2.5 shadow-xs">
                  <SelectValue>
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-full bg-chart-6">
                        <Landmark className="size-3.5 text-foreground" />
                      </div>
                      <span className="rounded-full bg-[#f3e8ce] px-2.5 py-0.5 text-xs font-semibold text-foreground">
                        {selectedAccount.id}
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        {selectedAccount.type}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="truncate text-sm font-medium text-muted-foreground">
                        {selectedAccount.owner}
                      </span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNT_OPTIONS.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded-full bg-chart-6">
                          <Landmark className="size-3.5 text-foreground" />
                        </div>
                        <span className="rounded-full bg-[#f3e8ce] px-2.5 py-0.5 text-xs font-semibold text-foreground">
                          {account.id}
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {account.type}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="truncate text-sm font-medium text-muted-foreground">
                          {account.owner}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* Account info rows */}
          <section className="space-y-1 px-2">
            <div className="flex h-9 items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Authorized users
              </p>
              <p className="text-sm font-medium text-foreground">
                Jim and Alexa Robinson
              </p>
            </div>
            <div className="flex h-9 items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <p className="text-sm font-medium text-foreground">
                200-390 Market Street, San Fransisco CA1
              </p>
            </div>
            <div className="pt-3">
              <div className="flex h-9 items-center justify-between">
                <p className="text-sm font-semibold text-foreground">
                  Funds available
                </p>
                <p className="text-sm font-medium text-foreground">{formatCurrency(FUNDS_AVAILABLE)}</p>
              </div>
              <div className="flex h-8 items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Cash available (Type 2)
                </p>
                <p className="text-sm text-foreground">$23,932.45</p>
              </div>
              <div className="flex h-8 items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  FDIC Sweep
                </p>
                <p className="text-sm text-foreground">$23,932.45</p>
              </div>
              <div className="flex h-8 items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Funds on hold
                </p>
                <p className="text-sm text-foreground">$23,932.45</p>
              </div>
            </div>
          </section>

          {/* Request amount */}
          <section className="space-y-1.5">
            <h2 className="font-serif text-[20px] font-medium leading-8 text-foreground">
              Request amount
            </h2>
            <div
              className={cn(
                'flex h-12 items-center rounded-md border bg-white px-3 transition-colors',
                exceedsFunds
                  ? 'border-red-500 ring-2 ring-red-500/20'
                  : 'border-input focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
              )}
            >
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={formatCurrency(amountCents)}
                onChange={handleAmountChange}
                onKeyDown={handleAmountKeyDown}
                className={cn(
                  'w-full bg-transparent text-right text-[18px] font-bold leading-6 tracking-tight outline-none placeholder:text-muted-foreground',
                  exceedsFunds ? 'text-red-600' : 'text-foreground'
                )}
                placeholder="$0.00"
                aria-label="Request amount"
              />
            </div>
            {exceedsFunds && (
              <p className="text-sm font-medium text-red-600">
                Amount exceeds available funds ({formatCurrency(FUNDS_AVAILABLE)})
              </p>
            )}
            <div className="flex h-9 items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Distribution date
              </span>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 px-3 text-xs font-medium text-primary hover:bg-transparent hover:text-primary"
                  >
                    {format(distributionDate, 'MMM d, yyyy')}
                    <CalendarDays className="size-3.5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={distributionDate}
                    onSelect={(date) => {
                      if (date) {
                        setDistributionDate(date)
                        setDatePickerOpen(false)
                      }
                    }}
                    defaultMonth={distributionDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </section>

          {/* ACH transfer — shown after entering an amount */}
          {!isEmpty && (
          <section className="space-y-4">
            <h2 className="font-serif text-[20px] font-medium leading-8 text-foreground">
              ACH transfer
            </h2>

            <div className="space-y-2">
              <div className="grid grid-cols-[24px_1fr_1fr_1fr_1fr] gap-4 px-2 text-sm font-semibold text-muted-foreground">
                <span />
                {ACH_COLUMNS.map((col) => (
                  <span key={col}>{col}</span>
                ))}
              </div>

              {ACH_ROWS.map((row) => {
                const isSelected = row.id === selectedRowId
                return (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => setSelectedRowId(row.id)}
                    className={cn(
                      'grid h-[58px] w-full grid-cols-[24px_1fr_1fr_1fr_1fr] items-center gap-4 rounded-md border border-solid px-5 text-left text-sm shadow-xs transition-colors',
                      isSelected
                        ? 'border-border bg-indigo-50'
                        : 'border-border bg-white hover:bg-muted/50'
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-6 items-center justify-center rounded-full border',
                        isSelected
                          ? 'border-[#c89a45] bg-[#f5f5f4]'
                          : 'border-border bg-[#f5f5f4]'
                      )}
                    >
                      {isSelected && (
                        <span className="size-2.5 rounded-full bg-[#9f6a00]" />
                      )}
                    </span>
                    {row.cells.map((cell, ci) => (
                      <span key={ci} className="truncate text-muted-foreground">
                        {cell}
                      </span>
                    ))}
                  </button>
                )
              })}
            </div>

            <div className="flex justify-center">
              <Button
                asChild
                variant="ghost"
                className="h-10 gap-2 px-8 text-sm font-medium text-primary hover:bg-transparent hover:text-primary"
              >
                <Link href={`/account/${accountId}/move-money/new-ach`}>
                  <Plus className="size-4" />
                  New ACH instructions
                </Link>
              </Button>
            </div>
          </section>
          )}
        </div>
      </main>

      {/* Fixed bottom buttons */}
      <div className="shrink-0 border-t border-border bg-white p-[10px]">
        <div className="flex items-center justify-center gap-10">
          <Button
            variant="outline"
            className="h-10 gap-2 bg-[#f5f5f4] px-8 text-sm font-medium"
            onClick={() => router.push(moveMoneyPath)}
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>
          <Button
            className="h-10 bg-black px-8 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-50"
            disabled={exceedsFunds || isEmpty}
            onClick={() => router.push(instructionsPath)}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
