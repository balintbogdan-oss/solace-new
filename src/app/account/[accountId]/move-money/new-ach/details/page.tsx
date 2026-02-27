'use client'

import { useState } from 'react'
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
  { id: 'read-confirm', label: 'Read & confirm', icon: BookCheck },
  { id: 'ach-authorization', label: 'ACH authorization', icon: ShieldCheck },
  { id: 'transfer-info', label: 'Transfer information', icon: ArrowRightLeft },
  { id: 'review', label: 'Review', icon: BookOpenCheck },
  { id: 'form-sent', label: 'Form sent', icon: LayoutList },
  { id: 'instruction-notes', label: 'Instruction notes', icon: NotebookPen },
] as const

export default function NewAchDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const accountId = params?.accountId as string

  const confirmClientPath = `/account/${accountId}/move-money/new-ach`
  const authorizationPath = `/account/${accountId}/move-money/new-ach/authorization`
  const [confirmed, setConfirmed] = useState(false)

  return (
    <div className="fixed inset-0 z-20 flex flex-col bg-white">
      <HeaderMoneyMovement />

      <div className="flex flex-1 overflow-hidden mx-auto max-w-[1440px] w-full">
        {/* Sidebar */}
        <aside className="flex w-fit shrink-0 flex-col gap-4 overflow-y-auto px-[142px] py-10">
          {/* Account info card */}
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

          {/* Step navigation */}
          <nav className="flex flex-col">
            {SIDEBAR_STEPS.map((step, i) => {
              const isActive = i === 0
              const Icon = step.icon
              return (
                <div
                  key={step.id}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-2 py-3 text-sm font-medium',
                    isActive
                      ? 'bg-[#f5f5f4] text-[#9f6a00]'
                      : 'text-[#3f3f3f] opacity-50'
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
          <div className="w-full max-w-[444px] space-y-8">
            <h1 className="font-serif text-[28px] font-medium leading-[48px] tracking-tight text-foreground">
              Read and confirm
            </h1>

            {/* Disclaimer */}
            <section className="space-y-0">
              <div className="flex h-10 items-center">
                <h2 className="font-serif text-[20px] font-medium leading-8 tracking-tight text-foreground">
                  Disclaimer
                </h2>
              </div>
              <div className="rounded-md border border-border bg-white p-3 shadow-xs">
                <p className="text-sm leading-5 text-foreground">
                  ACH setup requires a client{' '}
                  <strong>voided check or bank statement</strong>. If
                  unavailable, exit this flow and restart after collecting the
                  document.
                </p>
              </div>
            </section>

            {/* Signature disclaimer */}
            <section className="space-y-0">
              <div className="flex h-10 items-center">
                <h2 className="font-serif text-[20px] font-medium leading-8 tracking-tight text-foreground">
                  Signature disclaimer
                </h2>
              </div>
              <div className="rounded-md border border-border bg-white p-3 shadow-xs">
                <p className="text-sm leading-6 text-foreground">
                  Wet signatures are not supported in this workflow. If a wet
                  signature is required, process the request manually.
                </p>
              </div>
            </section>

            {/* Confirmation checkbox */}
            <button
              type="button"
              onClick={() => setConfirmed((v) => !v)}
              className={cn(
                'flex w-full items-start gap-4 rounded-lg border px-4 py-6 text-left shadow-xs transition-colors',
                confirmed
                  ? 'border-muted-foreground bg-accent'
                  : 'border-border bg-white'
              )}
            >
              <span
                className={cn(
                  'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm border shadow-sm',
                  confirmed
                    ? 'border-[#9f6a00] bg-[#9f6a00]'
                    : 'border-input bg-white'
                )}
              >
                {confirmed && (
                  <Check className="size-3 text-white" strokeWidth={3} />
                )}
              </span>
              <span className="text-sm leading-6 text-foreground">
                I confirm that I have obtained a void cheque or bank statement
                from the client.
              </span>
            </button>
          </div>
        </main>
      </div>

      {/* Bottom buttons */}
      <div className="shrink-0 border-t border-border bg-white p-[10px]">
        <div className="flex items-center justify-center gap-10">
          <Button
            variant="outline"
            className="h-10 gap-2 bg-[#f5f5f4] px-8 text-sm font-medium"
            onClick={() => router.push(confirmClientPath)}
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>
          <Button
            className="h-10 bg-black px-8 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-50"
            disabled={!confirmed}
            onClick={() => router.push(authorizationPath)}
          >
            Continue with e-signature
          </Button>
        </div>
      </div>
    </div>
  )
}
