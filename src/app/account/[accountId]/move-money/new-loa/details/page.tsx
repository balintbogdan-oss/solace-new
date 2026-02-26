'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Landmark, ChevronLeft } from 'lucide-react'
import { HeaderMoneyMovement } from '@/components/layout/HeaderMoneyMovement'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type LoaReason = 'check' | 'wire' | ''
type ClientNameType = 'same' | 'different' | ''

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
        'flex items-center gap-4 rounded-lg border px-4 py-6 text-left transition-colors',
        selected
          ? 'border-muted-foreground bg-accent'
          : 'border-border bg-white hover:bg-accent/50'
      )}
    >
      <span
        className={cn(
          'flex size-4 shrink-0 items-center justify-center rounded-full border shadow-sm',
          selected ? 'border-border bg-white' : 'border-border bg-white'
        )}
      >
        {selected && (
          <span className="size-[11px] rounded-full bg-[#d7a554]" />
        )}
      </span>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </button>
  )
}

export default function NewLoaDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const accountId = params?.accountId as string

  const confirmClientPath = `/account/${accountId}/move-money/new-loa`
  const outboundDisbursementPath = `/account/${accountId}/move-money/outbound/disbursement?method=wire&from=loa`
  const transferInfoPath = `/account/${accountId}/move-money/new-loa/transfer-info?flow=different`

  const [reason, setReason] = useState<LoaReason>('')
  const [clientNameType, setClientNameType] = useState<ClientNameType>('')

  const canContinue = reason !== '' && clientNameType !== ''

  const handleContinue = () => {
    if (!canContinue) return
    if (clientNameType === 'same') {
      router.push(outboundDisbursementPath)
    } else {
      router.push(transferInfoPath)
    }
  }

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
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto py-10">
          <div className="w-full max-w-[444px] space-y-8 pb-10">
            <div className="space-y-1">
              <h1 className="font-serif text-[28px] font-medium leading-[48px] tracking-tight text-foreground">
                LOA purpose
              </h1>
              <p className="text-sm text-muted-foreground">
                The reason for this Letter of Authorization
              </p>
            </div>

            {/* Reason for LOA */}
            <div className="space-y-4">
              <p className="text-sm font-medium text-foreground">
                The reason for this Letter of Authorization
              </p>
              <div className="flex gap-4">
                <RadioCard
                  label="Check"
                  selected={reason === 'check'}
                  onClick={() => setReason('check')}
                />
                <RadioCard
                  label="Wire"
                  selected={reason === 'wire'}
                  onClick={() => setReason('wire')}
                />
              </div>
            </div>

            {/* Client name type */}
            {reason !== '' && (
              <div className="space-y-4">
                <p className="text-sm font-medium text-foreground">
                  The reason for this Letter of Authorization
                </p>
                <div className="flex gap-4">
                  <RadioCard
                    label="Same client name"
                    selected={clientNameType === 'same'}
                    onClick={() => setClientNameType('same')}
                  />
                  <RadioCard
                    label="Different client name"
                    selected={clientNameType === 'different'}
                    onClick={() => setClientNameType('different')}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  If the client name matches the account name, an LOA is not
                  required.
                </p>
              </div>
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
            onClick={() => router.push(confirmClientPath)}
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>
          <Button
            className="h-10 bg-black px-8 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-50"
            disabled={!canContinue}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
