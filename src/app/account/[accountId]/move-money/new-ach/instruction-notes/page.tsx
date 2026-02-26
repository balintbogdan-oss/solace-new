'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Check,
  NotebookPen,
  Landmark,
  ChevronLeft,
  User,
  ShieldCheck,
} from 'lucide-react'
import { HeaderMoneyMovement } from '@/components/layout/HeaderMoneyMovement'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const SIDEBAR_STEPS = [
  { id: 'read-confirm', label: 'Read & confirm', completed: true },
  { id: 'ach-authorization', label: 'ACH authorization', completed: true },
  { id: 'transfer-info', label: 'Transfer information', completed: true },
  { id: 'review', label: 'Review', completed: true },
  { id: 'form-sent', label: 'Form sent', completed: true },
  { id: 'instruction-notes', label: 'Instruction notes', icon: NotebookPen, completed: false },
] as const

const ACTIVE_STEP = 5

const ADVISORS = [
  { id: '1', name: 'Matthew Hughes' },
  { id: '2', name: 'Sarah Chen' },
]

export default function NewAchInstructionNotesPage() {
  const router = useRouter()
  const params = useParams()
  const accountId = params?.accountId as string

  const formSentPath = `/account/${accountId}/move-money/new-ach/form-sent`
  const confirmationPath = `/account/${accountId}/move-money/new-ach/confirmation`

  const [advisorId, setAdvisorId] = useState(ADVISORS[0].id)
  const [purpose, setPurpose] = useState('')
  const [noteSummary, setNoteSummary] = useState('')

  const selectedAdvisor = ADVISORS.find((a) => a.id === advisorId) ?? ADVISORS[0]
  const canSubmit = purpose.trim().length > 0 && noteSummary.trim().length > 0

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
          <div className="w-full max-w-[444px] space-y-8 pb-10">
            <h1 className="font-serif text-[28px] font-medium leading-[48px] tracking-tight text-foreground">
              Instruction notes
            </h1>

            {/* Client requesting the transfer */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">
                Client requesting the transfer
              </p>
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

            {/* Advisor responsible for transfer */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">
                Advisor responsible for transfer
              </p>
              <Select value={advisorId} onValueChange={setAdvisorId}>
                <SelectTrigger className="h-10 w-full border-input bg-white px-2.5 shadow-xs">
                  <SelectValue>
                    <span className="flex items-center gap-3">
                      <Avatar className="size-7 shrink-0 rounded-full bg-chart-6">
                        <AvatarFallback className="bg-chart-6 text-black">
                          <ShieldCheck className="size-4" strokeWidth={2} />
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate text-sm font-semibold text-foreground">
                        {selectedAdvisor.name}
                      </span>
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {ADVISORS.map((advisor) => (
                    <SelectItem key={advisor.id} value={advisor.id}>
                      <span className="flex items-center gap-3">
                        <Avatar className="size-7 shrink-0 rounded-full bg-chart-6">
                          <AvatarFallback className="bg-chart-6 text-black">
                            <ShieldCheck className="size-4" strokeWidth={2} />
                          </AvatarFallback>
                        </Avatar>
                        {advisor.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Confirmation date */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">
                Confirmation date
              </p>
              <p className="pl-0.5 text-base text-muted-foreground">05/01/2025</p>
            </div>

            {/* Purpose of transfer */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">
                Purpose of transfer
              </p>
              <textarea
                className="min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-3 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
                placeholder="e.g. Gift"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Example gift to charity, transfer to joint account with spouse, etc.
              </p>
            </div>

            {/* Note summary */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Note summary</p>
              <textarea
                className="min-h-[100px] w-full rounded-md border border-input bg-white px-3 py-3 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
                placeholder="Summarize the conversation and transfer details..."
                value={noteSummary}
                onChange={(e) => setNoteSummary(e.target.value)}
              />
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
            onClick={() => router.push(formSentPath)}
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>
          <Button
            className="h-10 bg-black px-8 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-50"
            disabled={!canSubmit}
            onClick={() => router.push(confirmationPath)}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}
