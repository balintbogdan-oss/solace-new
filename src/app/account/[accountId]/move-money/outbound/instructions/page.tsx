'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, ShieldCheck, User } from 'lucide-react'
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

const ADVISORS = [
  { id: '1', name: 'Matthew Hughes' },
  { id: '2', name: 'Sarah Chen' },
]

export default function InstructionNotesPage() {
  const router = useRouter()
  const params = useParams()
  const accountId = params?.accountId as string

  const disbursementPath = `/account/${accountId}/move-money/outbound/disbursement`
  const reviewPath = `/account/${accountId}/move-money/outbound/review`

  const [purpose, setPurpose] = useState('')
  const [noteSummary, setNoteSummary] = useState('')
  const canContinue = purpose.trim().length > 0 && noteSummary.trim().length > 0

  return (
    <div className="fixed inset-0 z-20 flex flex-col bg-white">
      <HeaderMoneyMovement />

      <main className="flex flex-1 justify-center overflow-y-auto px-4 py-10">
        <div className="w-full max-w-[700px] space-y-8 pb-10">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Step 2 of 3</p>
            <h1 className="font-serif text-[28px] font-medium leading-[48px] tracking-tight text-foreground">
              Instruction notes
            </h1>
          </div>

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

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              Advisor responsible for transfer
            </p>
            <Select defaultValue={ADVISORS[0].id}>
              <SelectTrigger className="h-10 w-full border-input bg-white px-2.5 shadow-xs">
                <SelectValue>
                  <span className="flex items-center gap-3">
                    <Avatar className="size-7 shrink-0 rounded-full bg-chart-6">
                      <AvatarFallback className="bg-chart-6 text-black">
                        <ShieldCheck className="size-4" strokeWidth={2} />
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-sm font-semibold text-foreground">
                      Matthew Hughes
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

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              Confirmation date
            </p>
            <p className="pl-0.5 text-base text-muted-foreground">05/01/2025</p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              Purpose of transfer
            </p>
            <textarea
              className="min-h-[100px] w-full rounded-md border border-input bg-white px-3 py-3 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
              placeholder="e.g. Gift"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Example gift to charity, transfer to joint account with spouse, etc.
            </p>
          </div>

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

      <div className="shrink-0 border-t border-border bg-white p-[10px]">
        <div className="flex items-center justify-center gap-10">
          <Button
            variant="outline"
            className="h-10 gap-2 bg-[#f5f5f4] px-8 text-sm font-medium"
            onClick={() => router.push(disbursementPath)}
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>
          <Button
            className="h-10 bg-black px-8 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-50"
            disabled={!canContinue}
            onClick={() => router.push(reviewPath)}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
