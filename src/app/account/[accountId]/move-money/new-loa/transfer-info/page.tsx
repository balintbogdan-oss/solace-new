'use client'

import { useState, useCallback, useRef } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowRightLeft,
  SquarePlus,
  ShieldCheck,
  BookOpenCheck,
  LayoutList,
  NotebookPen,
  Landmark,
  ChevronLeft,
} from 'lucide-react'
import { HeaderMoneyMovement } from '@/components/layout/HeaderMoneyMovement'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const DIFFERENT_CLIENT_STEPS = [
  { id: 'transfer-info', label: 'Transfer information', icon: ArrowRightLeft },
  { id: 'wire-instructions', label: 'New wire instructions', icon: SquarePlus },
  { id: 'loa', label: 'Letter of authorization', icon: ShieldCheck },
  { id: 'review', label: 'Review', icon: BookOpenCheck },
  { id: 'form-sent', label: 'Form sent', icon: LayoutList },
  { id: 'instruction-notes', label: 'Instruction notes', icon: NotebookPen },
] as const

const SAME_CLIENT_STEPS = [
  { id: 'transfer-info', label: 'Transfer information', icon: ArrowRightLeft },
  { id: 'wire-instructions', label: 'New wire instructions', icon: SquarePlus },
  { id: 'instruction-notes', label: 'Instruction notes', icon: NotebookPen },
  { id: 'review', label: 'Review', icon: BookOpenCheck },
] as const

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(cents / 100)
}

export default function NewLoaTransferInfoPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const accountId = params?.accountId as string
  const flow = searchParams.get('flow') ?? 'different'
  const isDifferentClient = flow === 'different'

  const steps = isDifferentClient ? DIFFERENT_CLIENT_STEPS : SAME_CLIENT_STEPS
  const ACTIVE_STEP = 0

  const detailsPath = `/account/${accountId}/move-money/new-loa/details`
  const wireInstructionsPath = `/account/${accountId}/move-money/new-loa/wire-instructions?flow=${flow}`

  const [amountCents, setAmountCents] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const isEmpty = amountCents === 0

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    setAmountCents(Number(raw))
  }, [])

  return (
    <div className="fixed inset-0 z-20 flex flex-col bg-white">
      <HeaderMoneyMovement />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="flex w-[260px] shrink-0 flex-col gap-4 overflow-y-auto px-5 py-10">
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
            {steps.map((step, i) => {
              const isActive = i === ACTIVE_STEP
              const Icon = step.icon
              return (
                <div
                  key={step.id}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-2 py-3 text-sm font-medium',
                    isActive
                      ? 'bg-[#f5f5f4] text-[#9f6a00]'
                      : 'text-[#3f3f3f] opacity-40'
                  )}
                >
                  <Icon className="size-4 shrink-0" />
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Amount</label>
              <div
                className="flex h-10 w-full items-center rounded-md border border-input bg-white px-3 shadow-xs cursor-text"
                onClick={() => inputRef.current?.focus()}
              >
                <span className={cn('text-sm', isEmpty ? 'text-muted-foreground' : 'text-foreground')}>
                  {isEmpty ? '$0.00' : formatCurrency(amountCents)}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  value={amountCents === 0 ? '' : amountCents.toString()}
                  onChange={handleAmountChange}
                  className="sr-only"
                  aria-label="Amount"
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom buttons */}
      <div className="shrink-0 border-t border-border bg-white p-[10px]">
        <div className="flex items-center justify-center gap-10">
          <Button
            variant="outline"
            className="h-10 gap-2 bg-[#f5f5f4] px-8 text-sm font-medium"
            onClick={() => router.push(detailsPath)}
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>
          <Button
            className="h-10 bg-black px-8 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-50"
            disabled={isEmpty}
            onClick={() => router.push(wireInstructionsPath)}
          >
            {isDifferentClient ? 'Review' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  )
}
