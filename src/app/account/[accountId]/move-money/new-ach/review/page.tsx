'use client'

import { useParams, useRouter } from 'next/navigation'
import {
  Check,
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
  { id: 'read-confirm', label: 'Read & confirm', completed: true },
  { id: 'ach-authorization', label: 'ACH authorization', completed: true },
  { id: 'transfer-info', label: 'Transfer information', completed: true },
  { id: 'review', label: 'Review', icon: BookOpenCheck, completed: false },
  { id: 'form-sent', label: 'Form sent', icon: LayoutList, completed: false },
  { id: 'instruction-notes', label: 'Instruction notes', icon: NotebookPen, completed: false },
] as const

const ACTIVE_STEP = 3

function ReviewSection({
  title,
  rows,
  editPath,
  onEdit,
}: {
  title: string
  rows: { label: string; value: string }[]
  editPath?: string
  onEdit?: () => void
}) {
  return (
    <section className="space-y-1">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-[20px] font-medium leading-8 tracking-tight text-foreground">
          {title}
        </h2>
        {(editPath || onEdit) && (
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

export default function NewAchReviewPage() {
  const router = useRouter()
  const params = useParams()
  const accountId = params?.accountId as string

  const transferInfoPath = `/account/${accountId}/move-money/new-ach/transfer-info`
  const formSentPath = `/account/${accountId}/move-money/new-ach/form-sent`
  const confirmClientPath = `/account/${accountId}/move-money/new-ach`
  const authorizationPath = `/account/${accountId}/move-money/new-ach/authorization`

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
          <div className="w-full max-w-[500px] space-y-8 pb-10">
            <h1 className="font-serif text-[28px] font-medium leading-[48px] tracking-tight text-foreground">
              Review ACH instructions
            </h1>

            <ReviewSection
              title="Confirm the client"
              editPath={confirmClientPath}
              onEdit={() => router.push(confirmClientPath)}
              rows={[
                { label: 'Client on the joint account\nyou are servicing', value: 'Jim Robinson' },
              ]}
            />

            <ReviewSection
              title="Identification information"
              rows={[
                { label: 'FA code', value: 'CA10' },
                { label: 'Account number', value: '1PB10001' },
                { label: 'Account name', value: 'Jim Robinson' },
              ]}
            />

            <ReviewSection
              title="Bank account information"
              editPath={authorizationPath}
              onEdit={() => router.push(authorizationPath)}
              rows={[
                { label: 'Account name', value: 'Jim and Alexa Robinson' },
                { label: 'Bank account name', value: 'Jim Robinson' },
                { label: 'Institution name', value: 'Royal Bank of Canada' },
                { label: 'BA/routing number', value: '00002-003' },
                { label: 'Bank account number', value: '00002-002-123456789' },
                { label: 'Account type', value: 'Checking' },
              ]}
            />

            <ReviewSection
              title="Type of transfer"
              editPath={authorizationPath}
              onEdit={() => router.push(authorizationPath)}
              rows={[
                { label: 'Recurring transfer', value: 'Yes' },
                { label: 'Account type', value: 'Yes' },
                { label: 'From', value: 'Wedbush securities account' },
                { label: 'To', value: 'Bank account (specified)' },
                { label: 'Frequency', value: 'Daily' },
                { label: 'Beginning date', value: '05/11/2025' },
                { label: 'Frequency type', value: 'Incoming balance' },
              ]}
            />

            <ReviewSection
              title="Change of ownership"
              editPath={authorizationPath}
              onEdit={() => router.push(authorizationPath)}
              rows={[
                { label: 'Requiring change of ownership', value: 'Yes' },
                { label: 'Transfer from account type', value: 'Other' },
                { label: 'Specify other', value: 'Joint' },
                { label: 'Transfer in the name of', value: 'Jim Robinson' },
                { label: 'From the account number', value: '1PB100001' },
                { label: 'Ownership percentage of assets', value: '20%' },
                { label: 'Recurring transfer', value: 'Yes' },
                { label: 'Disclaimer', value: 'I confirm that transferring funds as specified will relinquish ownership % as specified of these assets' },
              ]}
            />

            <ReviewSection
              title="Transfer information"
              rows={[
                { label: 'Do you need to do a transfer?', value: 'Yes' },
                { label: 'Amount', value: '$250,000.00' },
                { label: 'Transfer type', value: 'Outbound (funds going out)' },
              ]}
            />
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
            className="h-10 bg-black px-8 text-sm font-medium text-white hover:bg-black/90"
            onClick={() => router.push(formSentPath)}
          >
            Review
          </Button>
        </div>
      </div>
    </div>
  )
}
