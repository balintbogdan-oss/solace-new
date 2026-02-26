'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Check,
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

const SIDEBAR_STEPS = [
  { id: 'transfer-info', label: 'Transfer information', icon: ArrowRightLeft, completed: true },
  { id: 'wire-instructions', label: 'New wire instructions', icon: SquarePlus, completed: true },
  { id: 'loa', label: 'Letter of authorization', icon: ShieldCheck, completed: false },
  { id: 'review', label: 'Review', icon: BookOpenCheck, completed: false },
  { id: 'form-sent', label: 'Form sent', icon: LayoutList, completed: false },
  { id: 'instruction-notes', label: 'Instruction notes', icon: NotebookPen, completed: false },
] as const

const ACTIVE_STEP = 2

type StandingLoa = 'yes' | 'no' | ''

function RadioCard({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-4 rounded-lg border px-4 py-3 text-left transition-colors',
        selected
          ? 'border-muted-foreground bg-accent'
          : 'border-border bg-white hover:bg-accent/50'
      )}
    >
      <span className="flex size-4 shrink-0 items-center justify-center rounded-full border border-border bg-white shadow-sm">
        {selected && <span className="size-[11px] rounded-full bg-[#d7a554]" />}
      </span>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </button>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-[36px] items-start justify-between gap-6 py-1">
      <span className="shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">{value}</span>
    </div>
  )
}

export default function NewLoaAuthorizationPage() {
  const router = useRouter()
  const params = useParams()
  const accountId = params?.accountId as string

  const wireInstructionsPath = `/account/${accountId}/move-money/new-loa/wire-instructions?flow=different`
  const reviewPath = `/account/${accountId}/move-money/new-loa/review`

  const [purpose, setPurpose] = useState('')
  const [standingLoa, setStandingLoa] = useState<StandingLoa>('')

  const canContinue = purpose.trim().length > 0 && standingLoa !== ''

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
            <div className="space-y-3">
              <h1 className="font-serif text-[28px] font-medium leading-[48px] tracking-tight text-foreground">
                Letter of authorization
              </h1>
              <p className="text-sm leading-6 text-muted-foreground">
                This Letter Of Authorization executed by the undersigned
                customer serves as formal notification to transfer the cash
                and/or securities listed in the Assets transfer instructions
                Section (&quot;client&quot; is used as singular or plural, as
                applicable).
              </p>
            </div>

            {/* Transaction purpose */}
            <section className="space-y-4">
              <h2 className="font-serif text-[20px] font-medium leading-8 tracking-tight text-foreground">
                Transaction purpose
              </h2>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Purpose</label>
                <textarea
                  className="min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-3 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
                  placeholder=""
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Example gift to charity, transfer to joint account with spouse, etc.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold leading-6 text-foreground">
                  Will the client use these instructions for future transfers to
                  the same third-party account (i.e., is this a Standing Letter
                  of Authorization)?
                </p>
                <div className="flex gap-4">
                  <RadioCard
                    label="Yes"
                    selected={standingLoa === 'yes'}
                    onClick={() => setStandingLoa('yes')}
                  />
                  <RadioCard
                    label="No"
                    selected={standingLoa === 'no'}
                    onClick={() => setStandingLoa('no')}
                  />
                </div>
              </div>
            </section>

            {/* Asset transfer instruction */}
            <section className="space-y-3">
              <h2 className="font-serif text-[20px] font-medium leading-8 tracking-tight text-foreground">
                Asset transfer instruction
              </h2>
              <InfoRow label="Amount of cash asset transfer" value="$250,000.00" />
            </section>

            {/* Authorization */}
            <section className="space-y-4">
              <h2 className="font-serif text-[20px] font-medium leading-8 tracking-tight text-foreground">
                Authorization
              </h2>
              <p className="text-sm text-muted-foreground">
                Please accept this form as authorization to transfer the assets.
              </p>

              {/* From */}
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">From</h3>
                <InfoRow label="Account type" value="Joint" />
                <InfoRow label="Account number" value="34978972" />
                <InfoRow label="In the name of" value="Sarah George" />
              </div>

              {/* To */}
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">To</h3>
                <InfoRow label="Destination options" value="Institution/brokerage firm" />
                <InfoRow label="Name of institution" value="Horizon Securities Inc." />
                <InfoRow label="Account number" value="89456123" />
                <InfoRow label="DTC# or ABA#" value="0444" />
                <InfoRow label="Beneficiary address" value="John A. Bridges" />
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Bottom buttons */}
      <div className="shrink-0 border-t border-border bg-white p-[10px]">
        <div className="flex items-center justify-center gap-10">
          <Button
            variant="outline"
            className="h-10 gap-2 bg-[#f5f5f4] px-8 text-sm font-medium"
            onClick={() => router.push(wireInstructionsPath)}
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>
          <Button
            className="h-10 bg-black px-8 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-50"
            disabled={!canContinue}
            onClick={() => router.push(reviewPath)}
          >
            Review
          </Button>
        </div>
      </div>
    </div>
  )
}
