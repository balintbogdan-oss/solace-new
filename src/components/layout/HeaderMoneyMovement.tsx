'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const OUTBOUND_STEPS = [
  { label: 'Outbound disbursement', segment: 'disbursement' },
  { label: 'Instruction notes', segment: 'instructions' },
  { label: 'Review', segment: 'review' },
] as const

const INBOUND_STEPS = [
  { label: 'Inbound disbursement', segment: 'inbound' },
  { label: 'Instruction notes', segment: 'instructions' },
  { label: 'Review', segment: 'review' },
] as const

const NEW_ACH_STEPS = [
  { label: 'New ACH instructions', segment: 'new-ach' },
] as const

const NEW_LOA_STEPS = [
  { label: 'New letter of authorization', segment: 'new-loa' },
] as const

const SIGN_ACH_STEPS = [
  { label: 'Sign ACH authorization form', segment: 'sign-ach' },
] as const

function getActiveStepIndex(pathname: string, steps: readonly { label: string; segment: string }[]): number {
  if (pathname.includes('/confirmation')) return steps.length
  for (let i = steps.length - 1; i >= 0; i--) {
    if (pathname.includes(`/${steps[i].segment}`)) return i
  }
  return 0
}

export function HeaderMoneyMovement({ hideStepper = false }: { hideStepper?: boolean } = {}) {
  const params = useParams()
  const pathname = usePathname()
  const accountId = params?.accountId as string
  const isOutboundFlow = pathname?.includes('/outbound/')
  const isInboundFlow = pathname?.includes('/inbound')
  const isNewAchFlow = pathname?.includes('/new-ach')
  const isNewLoaFlow = pathname?.includes('/new-loa')
  const isSignAchFlow = pathname?.includes('/sign-ach')
  const closePath = `/account/${accountId}/move-money`
  const steps = isSignAchFlow ? SIGN_ACH_STEPS : isNewLoaFlow ? NEW_LOA_STEPS : isNewAchFlow ? NEW_ACH_STEPS : isInboundFlow ? INBOUND_STEPS : OUTBOUND_STEPS
  const showStepper = isOutboundFlow || isInboundFlow || isNewAchFlow || isNewLoaFlow || isSignAchFlow
  const activeStep = showStepper ? getActiveStepIndex(pathname, steps) : -1

  return (
    <header
      className="relative flex h-16 shrink-0 items-center justify-between px-4 text-white"
      style={{ backgroundColor: 'var(--header-bg)' }}
    >
      <div className="flex items-center p-2">
        <svg
          width="28"
          height="17"
          viewBox="0 0 28 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M19.2158 1.93618C19.7433 0 21.326 0 21.326 0H27.3634L22.9672 14.492C22.4397 16.4282 20.857 16.4282 20.857 16.4282H14.8196L19.2158 1.93618ZM13.0025 1.64266C13.0025 1.64266 11.5957 1.64266 11.0682 3.40282L7.08228 16.428H12.4749C12.4749 16.428 13.8817 16.428 14.4093 14.6679L18.3952 1.58398L13.0025 1.64266ZM5.441 3.75516C5.441 3.75516 4.21006 3.75516 3.79975 5.28063L0.400024 16.4283H5.03069C5.03069 16.4283 6.26162 16.4283 6.67194 14.9028L10.0717 3.69649L5.441 3.75516Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {showStepper && !hideStepper && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2">
          {steps.map((step, i) => {
            const isCompleted = i < activeStep
            const isActive = i === activeStep

            return (
              <div key={step.segment} className="flex items-center gap-2">
                {i > 0 && <div className="h-px w-20 bg-white/40" />}
                <div className="flex items-center gap-1">
                  {isCompleted ? (
                    <span className="flex size-4 items-center justify-center rounded-full bg-[#d7a554]">
                      <Check className="size-2.5 text-white" strokeWidth={3} />
                    </span>
                  ) : (
                    <span
                      className={`size-2 rounded-full ${
                        isActive ? 'bg-[#d7a554]' : 'bg-white/40'
                      }`}
                    />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      isActive
                        ? 'text-[#d7a554]'
                        : isCompleted
                          ? 'text-white/60'
                          : 'text-white/40'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Button
        asChild
        variant="ghost"
        size="sm"
        className="h-9 gap-2 px-4 text-sm font-medium text-white hover:bg-white/10 hover:text-white"
      >
        <Link href={closePath}>
          <X className="size-4" aria-hidden />
          Close
        </Link>
      </Button>
    </header>
  )
}
