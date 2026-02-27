'use client'

import { useState, useRef, useCallback } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
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

const FUNDS_AVAILABLE = 1100

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

type TransferMethod = 'ach' | 'wire' | 'check' | 'branch-check'

const TRANSFER_METHODS: { id: TransferMethod; label: string }[] = [
  { id: 'ach', label: 'ACH' },
  { id: 'wire', label: 'Wire' },
  { id: 'check', label: 'Check' },
  { id: 'branch-check', label: 'Branch check' },
]

const ACH_COLUMNS = ['ABA number', 'Account type', 'Account number', 'Account name']
const ACH_ROWS = [
  { id: '1', cells: ['12345612312', 'Checking', '12415258166', 'Jim Robinson'] },
  { id: '2', cells: ['12345612312', 'Checking', '12415258166', 'Alexa Robinson'] },
]

const WIRE_COLUMNS = ['Customer bank account number', 'Customer name', 'Bank ABA #', 'Bank name']
const WIRE_ROWS = [
  { id: '1', cells: ['000577433674638', 'Isaako Mike Sopoaga', '321176833', 'Meriwest Credit Union'] },
  { id: '2', cells: ['000577433674638', 'Tumuaj Aoiy', '321176835', 'Meriwest Credit Union'] },
]

const TABLE_METHOD_CONFIG: Record<string, { columns: string[]; rows: { id: string; cells: string[] }[]; newLabel: string }> = {
  ach: { columns: ACH_COLUMNS, rows: ACH_ROWS, newLabel: 'New ACH instructions' },
  wire: { columns: WIRE_COLUMNS, rows: WIRE_ROWS, newLabel: 'New wire instructions' },
}

const CHECK_ACCOUNT_TYPES = [
  { id: 'cash', label: 'Cash' },
  { id: 'margin', label: 'Margin' },
  { id: 'short', label: 'Short' },
]

const CHECK_DELIVERY_MODES = [
  { id: 'mail', label: 'Mail check' },
  { id: 'overnight', label: 'Overnight check' },
  { id: 'hold', label: 'Hold at branch' },
]

const CHECK_ADDRESSES = [
  { id: '1', label: '200-390 Market Street, San Fransisco CA1' },
  { id: '2', label: '707-390 Market Street, San Fransisco CA1' },
]

const BRANCH_CHECK_OFFICES = [
  { id: 'la-retail', label: 'CA - Los Angeles retail' },
  { id: 'sf-retail', label: 'CA - San Francisco retail' },
  { id: 'ny-retail', label: 'NY - New York retail' },
]

export default function OutboundDisbursementPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const accountId = params?.accountId as string
  const clientName = searchParams.get('client') || 'Jim Robinson'

  const outboundPath = `/account/${accountId}/move-money/outbound`
  const instructionsPath = `/account/${accountId}/move-money/outbound/instructions`

  const [amountCents, setAmountCents] = useState(0)
  const [distributionDate, setDistributionDate] = useState<Date>(new Date(2025, 4, 5))
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [transferMethod, setTransferMethod] = useState<TransferMethod>('ach')
  const [selectedRowByMethod, setSelectedRowByMethod] = useState<Record<string, string>>({
    ach: ACH_ROWS[0].id,
    wire: WIRE_ROWS[0].id,
  })
  const [checkAccountType, setCheckAccountType] = useState('cash')
  const [checkDeliveryMode, setCheckDeliveryMode] = useState('mail')
  const [checkSelectedAddress, setCheckSelectedAddress] = useState(CHECK_ADDRESSES[0].id)
  const [branchCheckAccountType, setBranchCheckAccountType] = useState('cash')
  const [branchCheckOffice, setBranchCheckOffice] = useState(BRANCH_CHECK_OFFICES[0].id)
  const inputRef = useRef<HTMLInputElement>(null)

  const isTableMethod = transferMethod === 'ach' || transferMethod === 'wire'
  const tableConfig = isTableMethod ? TABLE_METHOD_CONFIG[transferMethod] : null
  const selectedRowId = selectedRowByMethod[transferMethod] ?? ''
  const setSelectedRowId = (id: string) =>
    setSelectedRowByMethod((prev) => ({ ...prev, [transferMethod]: id }))

  const amountDollars = amountCents / 100
  const exceedsFunds = amountDollars > FUNDS_AVAILABLE
  const isEmpty = amountCents === 0

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const cents = parseCentsFromInput(e.target.value)
    if (cents > 99999999999) return // cap at $999,999,999.99
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
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Step 1 of 3</p>
            <h1 className="font-serif text-[28px] font-medium leading-[48px] tracking-tight text-foreground">
              Outbound disbursement
            </h1>
          </div>

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
                  {clientName}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Account</p>
              <Select defaultValue={ACCOUNT_OPTIONS[0].id}>
                <SelectTrigger className="h-10 w-full border-input bg-background px-2.5 shadow-xs">
                  <SelectValue>
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-full bg-chart-6">
                        <Landmark className="size-3.5 text-foreground" />
                      </div>
                      <span className="rounded-full bg-[#f3e8ce] px-2.5 py-0.5 text-xs font-semibold text-foreground">
                        35337168
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        Joint
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="truncate text-sm font-medium text-muted-foreground">
                        Jim &amp; Alexa Robinson
                      </span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNT_OPTIONS.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.id} - {account.type} - {account.owner}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>

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
                <p className="text-sm font-medium text-foreground">1,100</p>
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
                Amount exceeds available funds ({formatCurrency(FUNDS_AVAILABLE * 100)})
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

          <section className="space-y-4">
            <h2 className="font-serif text-[20px] font-medium leading-8 text-foreground">
              Transfer method
            </h2>

            <div className="grid grid-cols-4 overflow-hidden rounded-md shadow-xs">
              {TRANSFER_METHODS.map((method, i) => {
                const isActive = transferMethod === method.id
                const isFirst = i === 0
                const isLast = i === TRANSFER_METHODS.length - 1
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setTransferMethod(method.id)}
                    className={cn(
                      'h-9 text-sm font-medium transition-colors border',
                      isFirst && 'rounded-l-md',
                      isLast && 'rounded-r-md',
                      isActive
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-input bg-white text-foreground hover:bg-muted/50'
                    )}
                  >
                    {method.label}
                  </button>
                )
              })}
            </div>

            {tableConfig ? (
              <>
                <div className="space-y-2">
                  <div className="grid grid-cols-[24px_1fr_1fr_1fr_1fr] gap-4 px-2 text-sm font-semibold text-muted-foreground">
                    <span />
                    {tableConfig.columns.map((col) => (
                      <span key={col}>{col}</span>
                    ))}
                  </div>

                  {tableConfig.rows.map((row) => {
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
                    variant="ghost"
                    className="h-10 gap-2 px-8 text-sm font-medium text-primary hover:bg-transparent hover:text-primary"
                  >
                    <Plus className="size-4" />
                    {tableConfig.newLabel}
                  </Button>
                </div>
              </>
            ) : transferMethod === 'check' ? (
              <>
                <div className="flex flex-wrap gap-[18px]">
                  <div className="w-[332px] space-y-2">
                    <p className="text-sm font-medium text-foreground">Account type</p>
                    <Select value={checkAccountType} onValueChange={setCheckAccountType}>
                      <SelectTrigger className="h-10 w-full border-border bg-white shadow-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CHECK_ACCOUNT_TYPES.map((t) => (
                          <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 min-w-[200px] space-y-2">
                    <p className="text-sm font-medium text-foreground">Delivery mode</p>
                    <Select value={checkDeliveryMode} onValueChange={setCheckDeliveryMode}>
                      <SelectTrigger className="h-10 w-full border-border bg-white shadow-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CHECK_DELIVERY_MODES.map((m) => (
                          <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-foreground">Credit/IRA instructions</p>
                  <textarea
                    disabled
                    className="min-h-[60px] w-full rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-foreground shadow-xs opacity-50 placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">Check purpose</p>
                  <input
                    disabled
                    className="h-9 w-full rounded-md border border-input bg-muted/50 px-3 text-sm text-foreground shadow-xs opacity-50 placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-4">
                  <h2 className="font-serif text-[20px] font-medium leading-8 text-foreground">
                    Delivery address
                  </h2>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      Existing address(s) on file
                    </p>
                    {CHECK_ADDRESSES.map((addr) => {
                      const isSelected = addr.id === checkSelectedAddress
                      return (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => setCheckSelectedAddress(addr.id)}
                          className={cn(
                            'flex w-full items-center gap-4 rounded-lg border px-4 py-6 text-left transition-colors',
                            isSelected
                              ? 'border-muted-foreground bg-accent'
                              : 'border-border hover:bg-muted/50'
                          )}
                        >
                          <span
                            className={cn(
                              'flex size-4 shrink-0 items-center justify-center rounded-full border shadow-sm',
                              isSelected
                                ? 'border-border bg-white'
                                : 'border-border bg-white'
                            )}
                          >
                            {isSelected && (
                              <span className="size-2 rounded-full bg-[#9f6a00]" />
                            )}
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {addr.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    If the address desired is not listed above a new letter of authorization will be required.
                  </p>

                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      className="h-10 gap-2 px-8 text-sm font-medium text-primary hover:bg-transparent hover:text-primary"
                    >
                      <Plus className="size-4" />
                      New Letter of authorization
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-wrap gap-4">
                  <div className="w-[291px] space-y-2">
                    <p className="text-sm font-medium text-foreground">Account type</p>
                    <Select value={branchCheckAccountType} onValueChange={setBranchCheckAccountType}>
                      <SelectTrigger className="h-10 w-full border-border bg-white shadow-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CHECK_ACCOUNT_TYPES.map((t) => (
                          <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 min-w-[200px] space-y-2">
                    <p className="text-sm font-medium text-foreground">Print at office</p>
                    <Select value={branchCheckOffice} onValueChange={setBranchCheckOffice}>
                      <SelectTrigger className="h-10 w-full border-border bg-white shadow-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BRANCH_CHECK_OFFICES.map((o) => (
                          <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-foreground">Credit/IRA instructions</p>
                  <textarea
                    disabled
                    className="min-h-[60px] w-full rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-foreground shadow-xs opacity-50 placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">Check purpose</p>
                  <input
                    disabled
                    className="h-9 w-full rounded-md border border-input bg-muted/50 px-3 text-sm text-foreground shadow-xs opacity-50 placeholder:text-muted-foreground"
                  />
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      <div className="shrink-0 border-t border-border bg-white p-[10px]">
        <div className="flex items-center justify-center gap-10">
          <Button
            variant="outline"
            className="h-10 gap-2 bg-[#f5f5f4] px-8 text-sm font-medium"
            onClick={() => {
              router.push(outboundPath)
            }}
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
