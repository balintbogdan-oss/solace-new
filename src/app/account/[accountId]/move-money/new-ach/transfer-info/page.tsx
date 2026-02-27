'use client'

import { useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  BookCheck,
  ShieldCheck,
  ArrowRightLeft,
  BookOpenCheck,
  LayoutList,
  NotebookPen,
  Landmark,
  ChevronLeft,
  Check,
} from 'lucide-react'
import { HeaderMoneyMovement } from '@/components/layout/HeaderMoneyMovement'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SIDEBAR_STEPS = [
  { id: 'read-confirm', label: 'Read & confirm', icon: BookCheck, completed: true },
  { id: 'ach-authorization', label: 'ACH authorization', icon: ShieldCheck, completed: true },
  { id: 'transfer-info', label: 'Transfer information', icon: ArrowRightLeft, completed: false },
  { id: 'review', label: 'Review', icon: BookOpenCheck, completed: false },
  { id: 'form-sent', label: 'Form sent', icon: LayoutList, completed: false },
  { id: 'instruction-notes', label: 'Instruction notes', icon: NotebookPen, completed: false },
] as const

const ACTIVE_STEP = 2

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

export default function NewAchTransferInfoPage() {
  const router = useRouter()
  const params = useParams()
  const accountId = params?.accountId as string

  const authorizationPath = `/account/${accountId}/move-money/new-ach/authorization`
  const reviewPath = `/account/${accountId}/move-money/new-ach/review`

  const [wantsTransfer, setWantsTransfer] = useState('')
  const [outboundSelected, setOutboundSelected] = useState(false)
  const [inboundSelected, setInboundSelected] = useState(false)
  const [amountCents, setAmountCents] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const hasAnswer = wantsTransfer !== ''
  const showFields = wantsTransfer === 'yes'
  const hasDirection = outboundSelected || inboundSelected
  const canReview = wantsTransfer === 'no' || (showFields && hasDirection && amountCents > 0)

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

      <div className="flex flex-1 overflow-hidden mx-auto max-w-[1440px] w-full">
        {/* Sidebar */}
        <aside className="flex w-fit shrink-0 flex-col gap-4 overflow-y-auto px-[142px] py-10">
          <div className="flex items-center gap-1.5">
            <div className="flex size-7 items-center justify-center rounded-[18px] bg-[#dbb069]">
              <Landmark className="size-3.5 text-foreground" />
            </div>
            <div className="flex min-w-0 flex-col">
              <p className="truncate text-sm font-medium text-muted-foreground">
                Jim Robinsons &amp; Alexa Robinson
              </p>
              <div className="flex items-center gap-0.5">
                <span className="text-sm font-semibold text-foreground">35337168</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-sm font-semibold text-foreground">Joint</span>
              </div>
            </div>
          </div>

          <nav className="flex flex-col">
            {SIDEBAR_STEPS.map((step, i) => {
              const isActive = i === ACTIVE_STEP
              const isCompleted = step.completed
              const Icon = isCompleted ? Check : step.icon
              return (
                <div
                  key={step.id}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-2 py-3 text-sm font-medium',
                    isActive
                      ? 'bg-[#f5f5f4] text-[#9f6a00]'
                      : isCompleted
                        ? 'text-[#3f3f3f]'
                        : 'text-[#3f3f3f] opacity-40'
                  )}
                >
                  <Icon className={cn('size-4 shrink-0', isCompleted && !isActive && 'text-positive-foreground')} />
                  <span className="truncate">{step.label}</span>
                </div>
              )
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto py-10">
          <div className="w-full max-w-[444px] space-y-8 pb-10">
            <h1 className="font-serif text-[28px] font-medium leading-[48px] tracking-tight text-foreground">
              Transfer information
            </h1>

            {/* Transfer amount */}
            <section className="space-y-4">
              <h2 className="font-serif text-[20px] font-medium leading-8 tracking-tight text-foreground">
                Transfer amount
              </h2>

              <p className="text-sm text-foreground">
                Does the customer wish to transfer funds tied to this ACH
                authorization form?
              </p>

              <div className="flex gap-2">
                {[
                  { id: 'yes', label: 'Yes' },
                  { id: 'no', label: 'No' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setWantsTransfer(opt.id)}
                    className={cn(
                      'flex h-9 items-center gap-2 rounded-md border px-5 text-sm font-medium transition-colors',
                      wantsTransfer === opt.id
                        ? 'border-[#9f6a00] bg-[#9f6a00]/10 text-foreground'
                        : 'border-border bg-white text-muted-foreground'
                    )}
                  >
                    {wantsTransfer === opt.id ? (
                      <span className="flex size-3.5 items-center justify-center rounded-full bg-[#9f6a00]">
                        <Check className="size-2 text-white" strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="size-3.5 rounded-full border border-border" />
                    )}
                    {opt.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Direction + Amount — show after Yes */}
            {showFields && (
              <>
                {/* Outbound card */}
                <button
                  type="button"
                  onClick={() => setOutboundSelected((v) => !v)}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors',
                    outboundSelected
                      ? 'border-muted-foreground bg-[#f5f5f4]'
                      : 'border-border bg-white'
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm border shadow-sm',
                      outboundSelected
                        ? 'border-[#9f6a00] bg-[#9f6a00]'
                        : 'border-input bg-white'
                    )}
                  >
                    {outboundSelected && (
                      <Check className="size-3 text-white" strokeWidth={3} />
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Outbound</p>
                    <p className="text-sm text-muted-foreground">Funds going out</p>
                  </div>
                </button>

                {/* Inbound card */}
                <button
                  type="button"
                  onClick={() => setInboundSelected((v) => !v)}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors',
                    inboundSelected
                      ? 'border-muted-foreground bg-[#f5f5f4]'
                      : 'border-border bg-white'
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm border shadow-sm',
                      inboundSelected
                        ? 'border-[#9f6a00] bg-[#9f6a00]'
                        : 'border-input bg-white'
                    )}
                  >
                    {inboundSelected && (
                      <Check className="size-3 text-white" strokeWidth={3} />
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Inbound</p>
                    <p className="text-sm text-muted-foreground">Funds coming in</p>
                  </div>
                </button>

                {/* Amount */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Amount</label>
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    value={formatCurrency(amountCents)}
                    onChange={handleAmountChange}
                    onKeyDown={handleAmountKeyDown}
                    placeholder="$0.00"
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  />
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Bottom buttons */}
      <div className="shrink-0 border-t border-border bg-white p-[10px]">
        <div className="flex items-center justify-center gap-10">
          <Button
            variant="outline"
            className="h-10 gap-2 bg-[#f5f5f4] px-8 text-sm font-medium"
            onClick={() => router.push(authorizationPath)}
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>
          <Button
            className="h-10 bg-black px-8 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-50"
            disabled={!hasAnswer || (showFields && !canReview)}
            onClick={() => router.push(reviewPath)}
          >
            Review
          </Button>
        </div>
      </div>
    </div>
  )
}
