'use client'

import { useState } from 'react'
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
  { id: 'wire-instructions', label: 'New wire instructions', icon: SquarePlus, completed: false },
  { id: 'loa', label: 'Letter of authorization', icon: ShieldCheck, completed: false },
  { id: 'review', label: 'Review', icon: BookOpenCheck, completed: false },
  { id: 'form-sent', label: 'Form sent', icon: LayoutList, completed: false },
  { id: 'instruction-notes', label: 'Instruction notes', icon: NotebookPen, completed: false },
] as const

const SAME_CLIENT_STEPS = [
  { id: 'transfer-info', label: 'Transfer information', icon: ArrowRightLeft, completed: true },
  { id: 'wire-instructions', label: 'New wire instructions', icon: SquarePlus, completed: false },
  { id: 'instruction-notes', label: 'Instruction notes', icon: NotebookPen, completed: false },
  { id: 'review', label: 'Review', icon: BookOpenCheck, completed: false },
] as const

const ACTIVE_STEP = 1

export default function NewLoaWireInstructionsPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const accountId = params?.accountId as string
  const flow = searchParams.get('flow') ?? 'different'
  const isDifferentClient = flow === 'different'

  const steps = isDifferentClient ? DIFFERENT_CLIENT_STEPS : SAME_CLIENT_STEPS

  const transferInfoPath = `/account/${accountId}/move-money/new-loa/transfer-info?flow=${flow}`
  const authorizationPath = `/account/${accountId}/move-money/new-loa/authorization`
  const instructionNotesPath = `/account/${accountId}/move-money/new-loa/instruction-notes?flow=same`

  const [receivingClientName, setReceivingClientName] = useState('')
  const [abaNumber, setAbaNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [institutionName, setInstitutionName] = useState('')
  const [institutionAddress, setInstitutionAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [institutionNumber, setInstitutionNumber] = useState('')
  const [instructions, setInstructions] = useState('')

  const canContinue =
    receivingClientName.trim().length > 0 &&
    abaNumber.trim().length > 0 &&
    institutionName.trim().length > 0

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
              New wire instructions
            </h1>

            <div className="space-y-6">
              <h2 className="font-serif text-[20px] font-medium leading-8 tracking-tight text-foreground">
                Contact information
              </h2>

              {/* Receiving client name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Receiving client name
                </label>
                <input
                  type="text"
                  value={receivingClientName}
                  onChange={(e) => setReceivingClientName(e.target.value)}
                  placeholder=""
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
                />
                <p className="text-sm text-muted-foreground">
                  If the client name matches the account name, an LOA is not
                  required.
                </p>
              </div>

              {/* Institution ABA number/SWIFT */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Institution ABA number/SWIFT
                </label>
                <input
                  type="text"
                  value={abaNumber}
                  onChange={(e) => setAbaNumber(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
                />
              </div>

              {/* Receiving institution phone number */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Receiving institution phone number
                </label>
                <div className="flex h-10 w-full items-center gap-2 rounded-md border border-input bg-white px-3 shadow-xs">
                  <span className="flex shrink-0 items-center gap-1 text-sm text-foreground">
                    🇺🇸 +1
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Receiving institution name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Receiving institution name
                </label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
                />
              </div>

              {/* Receiving institution address */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Receiving institution address
                </label>
                <input
                  type="text"
                  value={institutionAddress}
                  onChange={(e) => setInstitutionAddress(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
                />
              </div>

              {/* City / State / ZIP */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">ZIP</label>
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
                  />
                </div>
              </div>

              {/* Receiving institution number */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Receiving institution number
                </label>
                <input
                  type="text"
                  value={institutionNumber}
                  onChange={(e) => setInstitutionNumber(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
                />
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Instructions</label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="min-h-[100px] w-full rounded-md border border-input bg-white px-3 py-3 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
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
            onClick={() => router.push(transferInfoPath)}
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>
          <Button
            className="h-10 bg-black px-8 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-50"
            disabled={!canContinue}
            onClick={() => router.push(isDifferentClient ? authorizationPath : instructionNotesPath)}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
