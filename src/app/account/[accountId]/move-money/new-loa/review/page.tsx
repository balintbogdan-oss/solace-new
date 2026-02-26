'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
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

const DIFFERENT_CLIENT_STEPS = [
  { id: 'transfer-info', label: 'Transfer information', icon: ArrowRightLeft, completed: true },
  { id: 'wire-instructions', label: 'New wire instructions', icon: SquarePlus, completed: true },
  { id: 'loa', label: 'Letter of authorization', icon: ShieldCheck, completed: true },
  { id: 'review', label: 'Review', icon: BookOpenCheck, completed: false },
  { id: 'form-sent', label: 'Form sent', icon: LayoutList, completed: false },
  { id: 'instruction-notes', label: 'Instruction notes', icon: NotebookPen, completed: false },
] as const

const SAME_CLIENT_STEPS = [
  { id: 'transfer-info', label: 'Transfer information', completed: true },
  { id: 'wire-instructions', label: 'New wire instructions', completed: true },
  { id: 'instruction-notes', label: 'Instruction notes', completed: true },
  { id: 'review', label: 'Review', icon: BookOpenCheck, completed: false },
] as const

function ReviewSection({
  title,
  rows,
  onEdit,
}: {
  title: string
  rows: { label: string; value: string }[]
  onEdit?: () => void
}) {
  return (
    <section className="space-y-1">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-[20px] font-medium leading-8 tracking-tight text-foreground">
          {title}
        </h2>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-sm font-medium text-[#9f6a00] hover:underline"
          >
            Edit
          </button>
        )}
      </div>
      <div>
        {rows.map((row) => (
          <div key={row.label} className="flex min-h-[36px] items-start justify-between gap-6 py-1">
            <span className="shrink-0 text-sm text-muted-foreground">{row.label}</span>
            <span className="text-right text-sm font-medium text-foreground">{row.value}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function NewLoaReviewPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const accountId = params?.accountId as string
  const flow = searchParams.get('flow') ?? 'different'
  const isSameClient = flow === 'same'

  const steps = isSameClient ? SAME_CLIENT_STEPS : DIFFERENT_CLIENT_STEPS
  const activeStep = isSameClient ? 3 : 3

  const wireInstructionsPath = `/account/${accountId}/move-money/new-loa/wire-instructions?flow=${flow}`
  const instructionNotesPath = `/account/${accountId}/move-money/new-loa/instruction-notes?flow=${flow}`
  const transferInfoPath = `/account/${accountId}/move-money/new-loa/transfer-info?flow=${flow}`
  const authorizationPath = `/account/${accountId}/move-money/new-loa/authorization`
  const formSentPath = `/account/${accountId}/move-money/new-loa/form-sent`
  const confirmationPath = `/account/${accountId}/move-money/new-loa/confirmation?flow=${flow}`

  const backPath = isSameClient ? instructionNotesPath : authorizationPath
  const forwardPath = isSameClient ? confirmationPath : formSentPath

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
              const isActive = i === activeStep
              const isCompleted = step.completed
              const Icon = isCompleted ? Check : ('icon' in step ? step.icon : Check)
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
          <div className="w-full max-w-[500px] space-y-8 pb-10">
            <h1 className="font-serif text-[28px] font-medium leading-[48px] tracking-tight text-foreground">
              {isSameClient ? 'Review' : 'Review wire instructions'}
            </h1>

            <ReviewSection
              title="Transfer information"
              onEdit={() => router.push(isSameClient ? wireInstructionsPath : transferInfoPath)}
              rows={
                isSameClient
                  ? [{ label: 'Receiving client name', value: '$250,000.00' }]
                  : [{ label: 'Amount', value: '$250,000.00' }]
              }
            />

            <ReviewSection
              title="New wire instructions"
              onEdit={() => router.push(wireInstructionsPath)}
              rows={[
                { label: 'Receiving client name', value: 'Sarah George' },
                { label: 'Institution ABA number/SWIFT', value: '021302345' },
                { label: 'Receiving institution phone number', value: '545-837-2837' },
                { label: 'Receiving institution name', value: 'TD Canada' },
                { label: 'Receiving institution address', value: '76 Finch street west' },
                { label: 'City', value: 'Toronto' },
                { label: 'State', value: 'Ontario' },
                { label: 'Zip', value: 'M2N 7R0' },
                { label: 'Receiving institution number', value: '001234567890' },
                ...(isSameClient
                  ? [
                      { label: 'Account number', value: 'Send ASAP' },
                      { label: 'Instructions', value: 'Jim and Alexa Robinson' },
                    ]
                  : [{ label: 'Instructions', value: 'Send ASAP' }]),
              ]}
            />

            {isSameClient ? (
              <ReviewSection
                title="Instruction notes"
                onEdit={() => router.push(instructionNotesPath)}
                rows={[
                  { label: 'Client requesting the transfer', value: 'Jim Robinson' },
                  { label: 'Advisor responsible for transfer', value: 'Matthew Hughes' },
                  { label: 'Purpose of transfer', value: 'Gift' },
                  {
                    label: 'Note summary',
                    value:
                      'I, Matthew Hughes, spoke with Jim Robinson on May 1, 2025, at 10:45 AM. He requested a $250,000.00 wire transfer to account number ending in 2312.',
                  },
                ]}
              />
            ) : (
              <>
                <ReviewSection
                  title="Transaction purpose"
                  onEdit={() => router.push(authorizationPath)}
                  rows={[
                    { label: 'Purpose', value: 'Purchasing vacation home' },
                    {
                      label:
                        'Will the client use these instructions for future transfers to the same third-party account (i.e., is this a Standing Letter of Authorization)?',
                      value: 'Yes',
                    },
                  ]}
                />

                <section className="space-y-4">
                  <h2 className="font-serif text-[20px] font-medium leading-8 tracking-tight text-foreground">
                    Authorization
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Please accept this form as authorization to transfer the assets.
                  </p>

                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-foreground">From</h3>
                    <div className="flex min-h-[36px] items-start justify-between gap-6 py-1">
                      <span className="shrink-0 text-sm text-muted-foreground">Account type</span>
                      <span className="text-right text-sm font-medium text-foreground">Joint</span>
                    </div>
                    <div className="flex min-h-[36px] items-start justify-between gap-6 py-1">
                      <span className="shrink-0 text-sm text-muted-foreground">Account number</span>
                      <span className="text-right text-sm font-medium text-foreground">34978972</span>
                    </div>
                    <div className="flex min-h-[36px] items-start justify-between gap-6 py-1">
                      <span className="shrink-0 text-sm text-muted-foreground">In the name of</span>
                      <span className="text-right text-sm font-medium text-foreground">Sarah George</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-foreground">To</h3>
                    <div className="flex min-h-[36px] items-start justify-between gap-6 py-1">
                      <span className="shrink-0 text-sm text-muted-foreground">Destination options</span>
                      <span className="text-right text-sm font-medium text-foreground">Institution/brokerage firm</span>
                    </div>
                    <div className="flex min-h-[36px] items-start justify-between gap-6 py-1">
                      <span className="shrink-0 text-sm text-muted-foreground">Name of institution</span>
                      <span className="text-right text-sm font-medium text-foreground">Horizon Securities Inc.</span>
                    </div>
                    <div className="flex min-h-[36px] items-start justify-between gap-6 py-1">
                      <span className="shrink-0 text-sm text-muted-foreground">Account number</span>
                      <span className="text-right text-sm font-medium text-foreground">89456123</span>
                    </div>
                    <div className="flex min-h-[36px] items-start justify-between gap-6 py-1">
                      <span className="shrink-0 text-sm text-muted-foreground">DTC# or ABA#</span>
                      <span className="text-right text-sm font-medium text-foreground">0444</span>
                    </div>
                    <div className="flex min-h-[36px] items-start justify-between gap-6 py-1">
                      <span className="shrink-0 text-sm text-muted-foreground">Beneficiary address</span>
                      <span className="text-right text-sm font-medium text-foreground">John A. Bridges</span>
                    </div>
                  </div>
                </section>
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
            onClick={() => router.push(backPath)}
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>
          <Button
            className="h-10 bg-black px-8 text-sm font-medium text-white hover:bg-black/90"
            onClick={() => router.push(forwardPath)}
          >
            {isSameClient ? 'Submit' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  )
}
