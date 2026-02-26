'use client'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import {
  Check,
  LayoutList,
  NotebookPen,
  Landmark,
  ChevronLeft,
} from 'lucide-react'
import { HeaderMoneyMovement } from '@/components/layout/HeaderMoneyMovement'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SIDEBAR_STEPS = [
  { id: 'transfer-info', label: 'Transfer information', completed: true },
  { id: 'wire-instructions', label: 'New wire instructions', completed: true },
  { id: 'loa', label: 'Letter of authorization', completed: true },
  { id: 'review', label: 'Review', completed: true },
  { id: 'form-sent', label: 'Form sent', icon: LayoutList, completed: false },
  { id: 'instruction-notes', label: 'Instruction notes', icon: NotebookPen, completed: false },
] as const

const ACTIVE_STEP = 4

export default function NewLoaFormSentPage() {
  const router = useRouter()
  const params = useParams()
  const accountId = params?.accountId as string

  const reviewPath = `/account/${accountId}/move-money/new-loa/review`
  const instructionNotesPath = `/account/${accountId}/move-money/new-loa/instruction-notes`

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

        {/* Main content — form preview */}
        <main className="flex-1 overflow-y-auto py-10">
          <div className="w-full max-w-[700px] pb-10">
            <div className="relative border border-[#faf9f9]">
              <Image
                src="/loa-form-preview.png"
                alt="Letter of Authorization Form Preview"
                width={700}
                height={907}
                className="w-full"
                priority
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
            onClick={() => router.push(reviewPath)}
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>
          <Button
            className="h-10 bg-black px-8 text-sm font-medium text-white hover:bg-black/90"
            onClick={() => router.push(instructionNotesPath)}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
