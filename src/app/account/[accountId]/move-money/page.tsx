'use client'

export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'

type TransferStatus = 'awaiting_signature' | 'awaiting_approval' | 'processed' | 'rejected' | 'pending'
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
  { id: '0', dateCreated: 'May 1, 2025', moneyMovement: 'Outbound', transferMethod: 'ACH', requestAmount: 250000.0, status: 'awaiting_approval' },
  { id: '1', dateCreated: 'Apr 30, 2025', moneyMovement: 'Outbound', transferMethod: 'ACH', requestAmount: 250000.0, status: 'awaiting_signature' },
  { id: '2', dateCreated: 'Apr 28, 2025', moneyMovement: 'Outbound', transferMethod: 'Wire', requestAmount: 7063.79, status: 'awaiting_signature' },
  { id: '3', dateCreated: 'Apr 27, 2025', moneyMovement: 'Outbound', transferMethod: 'Check', requestAmount: 7855.82, status: 'awaiting_signature' },
  { id: '4', dateCreated: 'Apr 26, 2025', dateApproved: 'Apr 26, 2025', moneyMovement: 'Inbound', transferMethod: 'ACH', requestAmount: 13244.09, status: 'processed' },
  { id: '5', dateCreated: 'Apr 25, 2025', dateApproved: 'Apr 25, 2025', moneyMovement: 'Outbound', transferMethod: 'Wire', requestAmount: 12382.52, status: 'processed' },
]

const STATUS_CONFIG: Record<TransferStatus, { label: string; bg: string; text: string }> = {
  awaiting_approval: { label: 'Awaiting approval', bg: 'bg-amber-100', text: 'text-amber-700' },
  awaiting_signature: { label: 'Awaiting client signature', bg: 'bg-violet-100', text: 'text-violet-600' },
  processed: { label: 'Processed', bg: 'bg-lime-100', text: 'text-lime-700' },
  rejected: { label: 'Rejected', bg: 'bg-red-100', text: 'text-red-600' },
  pending: { label: 'Pending', bg: 'bg-amber-100', text: 'text-amber-700' },
}

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(v)

export default function MoveMoneyPage() {
  const params = useParams()
  const pathname = usePathname()
  const accountId = params?.accountId as string
  const outboundPath = pathname?.endsWith('/move-money')
    ? `${pathname}/outbound`
    : `/account/${accountId}/move-money/outbound`

  return (
    <div className="space-y-7 pb-3 !mt-0">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-[28px] font-medium font-serif tracking-tight leading-[48px]">Move money</h1>
        <p className="text-sm text-muted-foreground">Transfer funds and review all your previous transfers here.</p>
      </div>

      {/* Start a transfer */}
      <div className="space-y-5">
        <h2 className="text-xl font-medium font-serif tracking-tight">Start a transfer</h2>

        <div className="flex w-full gap-16 items-center pl-11 pb-7">
          {/* Transfer type buttons */}
          <div className="flex w-full gap-4 px-1">
            <Link
              href={outboundPath}
              className="flex flex-col items-center gap-5 group cursor-pointer w-full"
            >
              <div className="size-12 rounded-full bg-[#c5ceeb] shadow-[0px_0px_2px_1px_rgba(0,0,0,0.06)] flex items-center justify-center group-hover:scale-105 transition-transform">
                <MoveUp className="size-5 text-foreground" />
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="text-base font-medium">Outbound</span>
                <span className="text-base text-muted-foreground">Money going out</span>
              </div>
            </Link>

            <button className="flex flex-col items-center gap-5 group cursor-pointer w-full">
              <div className="size-12 rounded-full bg-[#dae8cd] shadow-[0px_0px_2px_1px_rgba(0,0,0,0.06)] flex items-center justify-center group-hover:scale-105 transition-transform">
                <MoveDown className="size-5 text-foreground" />
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="text-base font-medium">Inbound</span>
                <span className="text-base text-muted-foreground">Money coming in</span>
              </div>
            </button>

            <div className="flex flex-col items-center gap-5 opacity-55">
              <div className="size-12 rounded-full bg-[#e9e2d4] shadow-[0px_0px_2px_1px_rgba(0,0,0,0.06)] flex items-center justify-center">
                <ArrowUpDown className="size-5 text-foreground" />
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="text-base font-medium">Transfer between</span>
                <span className="text-base font-medium opacity-40 text-center w-[135px]">
                  Wedbush{'\n'}accounts
                </span>
                <span className="bg-muted-foreground/75 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Coming soon
                </span>
              </div>
            </div>
          </div>

          {/* Funds card */}
          <Card className="w-full px-8 py-6 flex flex-col gap-4">
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
              <Button variant="outline" className="w-full h-10">
                <Plus className="size-4 mr-2" />
                New ACH instructions
              </Button>
              <Button variant="outline" className="w-full h-10">
                <Plus className="size-4 mr-2" />
                New Letter of authorization
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
              {MOCK_TRANSFERS.map((t) => {
                const status = STATUS_CONFIG[t.status]
                return (
                  <tr key={t.id} className="border-b last:border-0 h-24 group hover:bg-muted/30 cursor-pointer">
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
  )
}
