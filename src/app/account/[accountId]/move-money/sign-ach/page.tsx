'use client'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { PenLine, Landmark } from 'lucide-react'
import { HeaderMoneyMovement } from '@/components/layout/HeaderMoneyMovement'
import { Button } from '@/components/ui/button'

export default function SignAchPage() {
  const router = useRouter()
  const params = useParams()
  const accountId = params?.accountId as string
  const moveMoneyPath = `/account/${accountId}/move-money`

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
            <div className="flex w-full items-center gap-2 rounded-md bg-[#f5f5f4] px-2 py-3 text-sm font-medium text-[#9f6a00]">
              <PenLine className="size-4 shrink-0" />
              <span className="truncate">Advisor signature</span>
            </div>
          </nav>
        </aside>

        {/* Main content — ACH form */}
        <main className="flex-1 overflow-y-auto py-10">
          <div className="w-full max-w-[700px] pb-10">
            <div className="relative border border-[#faf9f9]">
              <Image
                src="/ach-signing-form.png"
                alt="ACH Authorization Form"
                width={700}
                height={906}
                className="w-full"
                priority
              />
            </div>
          </div>
        </main>
      </div>

      {/* Bottom button */}
      <div className="shrink-0 border-t border-border bg-white p-[10px]">
        <div className="flex items-center justify-center">
          <Button
            className="h-10 bg-black px-8 text-sm font-medium text-white hover:bg-black/90"
            onClick={() => router.push(`/account/${accountId}/move-money/sign-ach/confirmation`)}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}
