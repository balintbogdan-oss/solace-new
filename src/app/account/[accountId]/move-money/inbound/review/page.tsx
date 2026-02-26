'use client'

import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HeaderMoneyMovement } from '@/components/layout/HeaderMoneyMovement'
import { cn } from '@/lib/utils'

const TRANSFER_ROWS = [
  { label: 'Account', value: 'Jim and Alexa Robinson' },
  { label: 'Account type', value: 'Joint (8293749)' },
  { label: 'Authorized users', value: 'Jim and Alexa Robinson' },
  { label: 'Address', value: '200-390 Market Street, San Fransisco CA' },
  { label: 'Request amount', value: '$250,000.00' },
  { label: 'Distribution date', value: '05/11/2025' },
  { label: 'Method of transfer', value: 'ACH' },
  { label: 'ABA number', value: '12345612312' },
  { label: 'Account type', value: 'Checking' },
  { label: 'Account number', value: '12415258166' },
  { label: 'Account name', value: 'Jim and Alexa Robinson' },
]

const INSTRUCTION_ROWS = [
  { label: 'Client requesting the transfer', value: 'Jim Robinson' },
  { label: 'Advisor responsible for transfer', value: 'Matthew Hughes' },
  { label: 'Purpose of transfer', value: 'Gift' },
  {
    label: 'Note summary',
    value:
      'Matthew Hughes, spoke with Jim Robinson on May 1, 2025, at 10:45 AM. He requested a $250,000.00 ACH transfer into his Wedbush account.',
    multiline: true,
  },
]

function ReviewSection({
  title,
  rows,
  onEdit,
}: {
  title: string
  rows: { label: string; value: string; multiline?: boolean }[]
  onEdit?: () => void
}) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-medium text-foreground">
          {title}
        </h2>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-sm font-medium text-primary"
          >
            Edit
          </button>
        )}
      </div>
      <div className="space-y-2 pb-6">
        {rows.map((row, i) => (
          <div
            key={`${row.label}-${i}`}
            className="flex min-h-[36px] items-start gap-20"
          >
            <span className="w-[188px] shrink-0 text-sm font-medium text-muted-foreground">
              {row.label}
            </span>
            <span
              className={cn(
                'text-sm font-medium text-foreground',
                row.multiline && 'flex-1'
              )}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function InboundReviewPage() {
  const router = useRouter()
  const params = useParams()
  const accountId = params?.accountId as string

  const inboundPath = `/account/${accountId}/move-money/inbound`
  const instructionsPath = `/account/${accountId}/move-money/inbound/instructions`
  const confirmationPath = `/account/${accountId}/move-money/inbound/confirmation`

  return (
    <div className="fixed inset-0 z-20 flex flex-col bg-white">
      <HeaderMoneyMovement />

      <main className="flex flex-1 justify-center overflow-y-auto px-4 py-10">
        <div className="w-full max-w-[700px] space-y-8 pb-10">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Step 3 of 3</p>
            <h1 className="font-serif text-[28px] font-medium leading-[48px] tracking-tight text-foreground">
              Review
            </h1>
          </div>

          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-medium text-foreground">
                Type of transfer
              </h2>
              <button
                className="text-sm font-medium text-primary"
                onClick={() => router.push(inboundPath)}
              >
                Edit
              </button>
            </div>
            <div className="flex h-[60px] items-center gap-20 rounded-2xl bg-muted px-6 shadow-[0_0_2px_1px_rgba(0,0,0,0.06)]">
              <span className="w-[188px] shrink-0 text-sm font-medium text-muted-foreground">
                Money movement type
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                Inbound
              </span>
            </div>
          </section>

          <ReviewSection
            title="Inbound transfer"
            rows={TRANSFER_ROWS}
            onEdit={() => router.push(inboundPath)}
          />

          <ReviewSection
            title="Instruction notes"
            rows={INSTRUCTION_ROWS}
            onEdit={() => router.push(instructionsPath)}
          />
        </div>
      </main>

      <div className="shrink-0 border-t border-border bg-white p-[10px]">
        <div className="flex items-center justify-center gap-10">
          <Button
            variant="outline"
            className="h-10 gap-2 bg-[#f5f5f4] px-8 text-sm font-medium"
            onClick={() => router.push(instructionsPath)}
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>
          <Button
            className="h-10 bg-black px-8 text-sm font-medium text-white hover:bg-black/90"
            onClick={() => router.push(confirmationPath)}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}
