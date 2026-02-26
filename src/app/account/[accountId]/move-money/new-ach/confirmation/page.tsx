'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { BookmarkCheck, Clock4 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HeaderMoneyMovement } from '@/components/layout/HeaderMoneyMovement'

export default function NewAchConfirmationPage() {
  const params = useParams()
  const accountId = params?.accountId as string
  const moveMoneyPath = `/account/${accountId}/move-money`

  return (
    <div className="fixed inset-0 z-20 flex flex-col bg-white">
      <HeaderMoneyMovement />

      <main className="flex flex-1 flex-col items-center justify-start overflow-y-auto px-4 pt-10">
        <div className="flex w-full max-w-[700px] flex-col items-center gap-8">
          {/* ACH instructions submitted */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-[#ecfccb]">
              <BookmarkCheck className="size-7 text-foreground" strokeWidth={1.5} />
            </div>

            <h1 className="font-serif text-2xl font-normal tracking-tight text-foreground">
              ACH instructions submitted
            </h1>

            <p className="max-w-[448px] text-center text-base leading-6 text-muted-foreground">
              ACH instructions are sent to the customer for signing.
              Once all required signatures and approvals are all
              gathered, please return to the Money Movement page and
              continue your transfer.
            </p>
          </div>

          {/* Transfer awaiting document approval */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-[#fef9c3]">
              <Clock4 className="size-7 text-foreground" strokeWidth={1.5} />
            </div>

            <h2 className="font-serif text-2xl font-normal tracking-tight text-foreground">
              Transfer awaiting document approval
            </h2>

            <p className="max-w-[448px] text-center text-base leading-6 text-muted-foreground">
              You will not be able to finalize the transfer until ACH
              instructions have been approved.
            </p>

            <Button
              asChild
              className="h-10 bg-black px-8 text-sm font-medium text-white hover:bg-black/90"
            >
              <Link href={moveMoneyPath}>Go back to money movement</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
