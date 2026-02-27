'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  MoveUp,
  MoveDown,
  ArrowUpDown,
  BadgeDollarSign,
  BadgeCheck,
  Plus,
  ChevronRight,
  X,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type TransferStatus = 'awaiting_signature' | 'awaiting_approval' | 'submitted_to_credit' | 'ready_to_sign' | 'processed' | 'rejected' | 'pending'
type MoneyMovement = 'Outbound' | 'Inbound'
type TransferMethod = 'ACH' | 'Wire' | 'Check'

interface TransferRecord {
  id: string
  dateCreated: string
  dateApproved?: string
  moneyMovement: MoneyMovement
  transferMethod: TransferMethod
  requestAmount: number
  status: TransferStatus
}

const MOCK_TRANSFERS: TransferRecord[] = [
  { id: 'loa-same-wire', dateCreated: 'May 1, 2025', moneyMovement: 'Outbound', transferMethod: 'Wire', requestAmount: 250000.0, status: 'submitted_to_credit' },
  { id: 'loa-wire', dateCreated: 'May 1, 2025', moneyMovement: 'Outbound', transferMethod: 'Wire', requestAmount: 250000.0, status: 'awaiting_signature' },
  { id: '0', dateCreated: 'May 1, 2025', moneyMovement: 'Outbound', transferMethod: 'ACH', requestAmount: 250000.0, status: 'awaiting_approval' },
  { id: '1', dateCreated: 'Apr 30, 2025', moneyMovement: 'Outbound', transferMethod: 'ACH', requestAmount: 250000.0, status: 'awaiting_signature' },
  { id: '2', dateCreated: 'Apr 28, 2025', moneyMovement: 'Outbound', transferMethod: 'Wire', requestAmount: 7063.79, status: 'awaiting_signature' },
  { id: '3', dateCreated: 'Apr 27, 2025', moneyMovement: 'Outbound', transferMethod: 'Check', requestAmount: 7855.82, status: 'awaiting_signature' },
  { id: 'sign-ach', dateCreated: 'Apr 27, 2025', moneyMovement: 'Outbound', transferMethod: 'ACH', requestAmount: 100000.0, status: 'ready_to_sign' },
  { id: '4', dateCreated: 'Apr 26, 2025', dateApproved: 'Apr 26, 2025', moneyMovement: 'Inbound', transferMethod: 'ACH', requestAmount: 13244.09, status: 'processed' },
  { id: '5', dateCreated: 'Apr 25, 2025', dateApproved: 'Apr 25, 2025', moneyMovement: 'Outbound', transferMethod: 'Wire', requestAmount: 12382.52, status: 'processed' },
]

const STATUS_CONFIG: Record<TransferStatus, { label: string; bg: string; text: string }> = {
  awaiting_approval: { label: 'Awaiting approval', bg: 'bg-amber-100', text: 'text-amber-700' },
  awaiting_signature: { label: 'Awaiting client signature', bg: 'bg-violet-100', text: 'text-violet-600' },
  submitted_to_credit: { label: 'Submitted to credit', bg: 'bg-sky-100', text: 'text-sky-700' },
  ready_to_sign: { label: 'Ready to sign', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  processed: { label: 'Processed', bg: 'bg-lime-100', text: 'text-lime-700' },
  rejected: { label: 'Rejected', bg: 'bg-red-100', text: 'text-red-600' },
  pending: { label: 'Pending', bg: 'bg-amber-100', text: 'text-amber-700' },
}

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(v)

function TransferTimelinePanel({
  transfer,
  onClose,
}: {
  transfer: TransferRecord
  onClose: () => void
}) {
  const methodLabel = transfer.transferMethod === 'ACH'
    ? 'ACH instructions'
    : transfer.transferMethod === 'Wire'
      ? 'Wire instructions'
      : 'Check instructions'

  const isProcessed = transfer.status === 'processed'
  const isSubmittedToCredit = transfer.status === 'submitted_to_credit'
  const isAwaitingApproval = transfer.status === 'awaiting_approval'

  const allCompleted = [
    { label: 'Client', status: 'Completed', dimmed: false },
    { label: 'Advisor', status: 'Completed', dimmed: false },
    { label: 'Money movement desk', status: 'Completed', dimmed: false },
    { label: 'Credit team', status: 'Completed', dimmed: false },
  ]

  const timelineSteps = (isProcessed || isSubmittedToCredit)
    ? allCompleted
    : isAwaitingApproval
      ? [
          { label: 'Client', status: 'Completed', dimmed: false },
          { label: 'Advisor', status: 'Completed', dimmed: false },
          { label: 'Money movement desk', status: 'Awaiting signature', dimmed: false },
          { label: 'Credit team', status: null as string | null, dimmed: true },
        ]
      : [
          { label: 'Client', status: 'Awaiting signature' as string | null, dimmed: false },
          { label: 'Advisor', status: null, dimmed: true },
          { label: 'Money movement desk', status: null, dimmed: true },
          { label: 'Credit team', status: null, dimmed: true },
        ]

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-[490px] flex-col border-l border-border bg-white p-6 shadow-lg animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-medium text-foreground">
            Transfer timeline
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-md border border-border bg-white hover:bg-muted/50"
          >
            <X className="size-[18px] text-foreground" />
          </button>
        </div>

        {/* Timeline */}
        <div className="mt-8 flex gap-4">
          {/* Vertical progress line */}
          <div className="flex w-3.5 flex-col items-center">
            <div className="flex size-3.5 shrink-0 items-center justify-center rounded-full bg-lime-500">
              <Check className="size-2.5 text-white" strokeWidth={3} />
            </div>
            <div className="w-px flex-1 bg-lime-500/40" />
            <div className={cn('size-3.5 shrink-0 rounded-full', isProcessed ? 'bg-lime-500' : 'bg-lime-500/40')} />
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col gap-6">
            {/* Created row */}
            <div className="flex items-center justify-between">
              <span className="text-base text-slate-800">
                {methodLabel} created
              </span>
              <span className="text-base text-slate-800">
                {transfer.dateCreated}, 10:45am
              </span>
            </div>

            {/* Steps */}
            {timelineSteps.map((step) => (
              <div
                key={step.label}
                className={cn(
                  'flex items-center justify-between',
                  step.dimmed && 'opacity-40'
                )}
              >
                <span className="text-base text-slate-800">{step.label}</span>
                {step.status && (
                  <span className="text-base font-semibold text-slate-800">
                    {step.status}
                  </span>
                )}
              </div>
            ))}

            {/* Approved row */}
            <div className={cn('flex items-center justify-between', !(isSubmittedToCredit || isProcessed) && 'opacity-40')}>
              <span className="text-base text-slate-800">
                {methodLabel} approved
              </span>
              {isSubmittedToCredit && (
                <span className="text-base font-semibold text-slate-800">
                  Processing
                </span>
              )}
              {isProcessed && transfer.dateApproved && (
                <span className="text-base text-slate-800">
                  {transfer.dateApproved}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function MoveMoneyPage() {
  const params = useParams()
  const pathname = usePathname()
  const accountId = params?.accountId as string
  const outboundPath = pathname?.endsWith('/move-money')
    ? `${pathname}/outbound`
    : `/account/${accountId}/move-money/outbound`
  const inboundPath = pathname?.endsWith('/move-money')
    ? `${pathname}/inbound`
    : `/account/${accountId}/move-money/inbound`

  const router = useRouter()
  const [selectedTransfer, setSelectedTransfer] = useState<TransferRecord | null>(null)
  const [transfers, setTransfers] = useState<TransferRecord[]>(MOCK_TRANSFERS)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('submittedTransfers') || '[]') as TransferRecord[]
      if (stored.length > 0) {
        setTransfers([...stored, ...MOCK_TRANSFERS])
      }
    } catch {}
  }, [])

  const handleRowClick = (transfer: TransferRecord) => {
    if (transfer.status === 'ready_to_sign') {
      router.push(`/account/${accountId}/move-money/sign-ach`)
      return
    }
    if (transfer.status === 'awaiting_signature' || transfer.status === 'submitted_to_credit' || transfer.status === 'awaiting_approval' || transfer.status === 'processed') {
      setSelectedTransfer((prev) => prev?.id === transfer.id ? null : transfer)
    }
  }

  return (
    <div>
      <div className="space-y-7 pb-3 !mt-0">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-[28px] font-medium font-serif tracking-tight leading-[48px]">Move money</h1>
            <p className="text-sm text-muted-foreground">Transfer funds and review all your previous transfers here.</p>
          </div>

          {/* Start a transfer */}
          <div className="space-y-5">
            <h2 className="text-xl font-medium font-serif tracking-tight">Start a transfer</h2>

            <div className="flex w-full items-start gap-16 pb-7">
              {/* Transfer type buttons */}
              <div className="flex flex-1 min-w-0">
                <Link
                  href={outboundPath}
                  className="flex flex-1 flex-col items-center gap-5 group cursor-pointer"
                >
                  <div className="size-16 rounded-full bg-[#c5ceeb] shadow-[0px_0px_2px_1px_rgba(0,0,0,0.06)] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <MoveUp className="size-5 text-foreground" />
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <span className="text-base font-medium group-hover:text-primary transition-colors">Outbound</span>
                    <span className="text-base text-muted-foreground">Money going out</span>
                  </div>
                </Link>

                <Link
                  href={inboundPath}
                  className="flex flex-1 flex-col items-center gap-5 group cursor-pointer"
                >
                  <div className="size-16 rounded-full bg-[#dae8cd] shadow-[0px_0px_2px_1px_rgba(0,0,0,0.06)] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <MoveDown className="size-5 text-foreground" />
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <span className="text-base font-medium group-hover:text-primary transition-colors">Inbound</span>
                    <span className="text-base text-muted-foreground">Money coming in</span>
                  </div>
                </Link>

                <div className="flex flex-1 flex-col items-center gap-5 opacity-55">
                  <div className="size-16 rounded-full bg-[#e9e2d4] shadow-[0px_0px_2px_1px_rgba(0,0,0,0.06)] flex items-center justify-center">
                    <ArrowUpDown className="size-5 text-foreground" />
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <span className="text-base font-medium">Transfer between</span>
                    <span className="text-base font-medium opacity-40 text-center whitespace-nowrap">
                      Wedbush accounts
                    </span>
                    <span className="bg-[var(--card-foreground)] text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Coming soon
                    </span>
                  </div>
                </div>
              </div>

              {/* Funds card */}
              <Card className="flex-1 min-w-0 px-8 py-6 flex flex-col gap-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <BadgeDollarSign className="size-6 text-foreground" />
                      <span className="text-base font-semibold">Funds available</span>
                    </div>
                    <span className="text-base font-semibold">$1,000,000.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <BadgeCheck className="size-4 text-foreground" />
                      <span className="text-base">ACH authorized</span>
                    </div>
                    <span className="text-base">Yes</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button asChild variant="outline" className="w-full h-10">
                    <Link href={`/account/${accountId}/move-money/new-ach`}>
                      <Plus className="size-4 mr-2" />
                      New ACH instructions
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full h-10">
                    <Link href={`/account/${accountId}/move-money/new-loa`}>
                      <Plus className="size-4 mr-2" />
                      New Letter of authorization
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Recent transfers */}
          <Card className="!mt-0 overflow-hidden flex flex-col gap-5">
            <div className="pb-3">
              <h2 className="text-xl font-medium font-serif tracking-tight leading-8">Recent transfers</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/60 rounded-lg">
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground text-sm rounded-l-lg">Date created</th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground text-sm">Date approved</th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground text-sm">Money movement</th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground text-sm">Transfer method</th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground text-sm">Request amount</th>
                    <th className="text-right py-2 px-2 font-medium text-muted-foreground text-sm">Transfer status</th>
                    <th className="py-2 px-2 rounded-r-lg w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {transfers.map((t) => {
                    const status = STATUS_CONFIG[t.status]
                    const isSelected = selectedTransfer?.id === t.id
                    const isClickable = t.status === 'awaiting_signature' || t.status === 'ready_to_sign' || t.status === 'submitted_to_credit' || t.status === 'awaiting_approval' || t.status === 'processed'
                    return (
                      <tr
                        key={t.id}
                        onClick={() => handleRowClick(t)}
                        className={cn(
                          'border-b last:border-0 h-24 group hover:bg-muted/30',
                          isClickable && 'cursor-pointer',
                          isSelected && 'bg-muted/40'
                        )}
                      >
                        <td className="py-2 px-2">{t.dateCreated}</td>
                        <td className="py-2 px-2">{t.dateApproved || ''}</td>
                        <td className="py-2 px-2">{t.moneyMovement}</td>
                        <td className="py-2 px-2 font-semibold">{t.transferMethod}</td>
                        <td className="py-2 px-2 text-left">{formatCurrency(t.requestAmount)}</td>
                        <td className="py-2 px-2 text-right">
                          <span className={cn('inline-flex rounded-lg px-2.5 py-0.5 text-sm font-medium', status.bg, status.text)}>
                            {status.label}
                          </span>
                        </td>
                        <td className="py-2 px-0 text-center">
                          <ChevronRight className="size-4 text-muted-foreground inline-block" />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Footer */}
        <div className="text-center py-6 text-xs">
          <span className="text-foreground">Copyright &copy; 2025 by Wedbush Securities. All Rights Reserved. </span>
          <span className="text-[#9f6a00]">Disclosures &amp; Legal</span>
        </div>
      </div>

      {/* Transfer Timeline Panel */}
      {selectedTransfer && (
        <TransferTimelinePanel
          transfer={selectedTransfer}
          onClose={() => setSelectedTransfer(null)}
        />
      )}
    </div>
  )
}
