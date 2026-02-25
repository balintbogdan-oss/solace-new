'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { User, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const MOCK_CLIENTS = [
  { id: '1', name: 'Jim Robinson' },
  { id: '2', name: 'Alexa Robinson' },
  { id: '3', name: 'Sarah Chen' },
  { id: '4', name: 'Michael Torres' },
  { id: '5', name: 'David Nakamura' },
  { id: '6', name: 'Emily Whitfield' },
  { id: '7', name: 'Rachel Goldstein' },
  { id: '8', name: 'Carlos Mendez' },
]

/** Wedbush mark used in the Figma header */
function ThreeBarsLogo({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="17"
      viewBox="0 0 28 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('text-white', className)}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.2158 1.93618C19.7433 0 21.326 0 21.326 0H27.3634L22.9672 14.492C22.4397 16.4282 20.857 16.4282 20.857 16.4282H14.8196L19.2158 1.93618ZM13.0025 1.64266C13.0025 1.64266 11.5957 1.64266 11.0682 3.40282L7.08228 16.428H12.4749C12.4749 16.428 13.8817 16.428 14.4093 14.6679L18.3952 1.58398L13.0025 1.64266ZM5.441 3.75516C5.441 3.75516 4.21006 3.75516 3.79975 5.28063L0.400024 16.4283H5.03069C5.03069 16.4283 6.26162 16.4283 6.67194 14.9028L10.0717 3.69649L5.441 3.75516Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function OutboundConfirmClientPage() {
  const router = useRouter()
  const params = useParams()
  const accountId = params?.accountId as string
  const moveMoneyPath = `/account/${accountId}/move-money`
  const disbursementPath = `/account/${accountId}/move-money/outbound/disbursement`

  const [selectedClientId, setSelectedClientId] = useState(MOCK_CLIENTS[0].id)
  const selectedClient = MOCK_CLIENTS.find((c) => c.id === selectedClientId)!

  return (
    <div className="fixed inset-0 z-20 flex flex-col bg-white">
      <header
        className="flex h-16 shrink-0 items-center justify-between bg-secondary px-4 text-secondary-foreground"
        role="banner"
      >
        <div className="flex items-center p-2">
          <ThreeBarsLogo />
        </div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-9 gap-2 px-4 text-sm font-medium text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground"
        >
          <Link href={moveMoneyPath} aria-label="Close and return to Move money">
            <X className="size-4" aria-hidden />
            Close
          </Link>
        </Button>
      </header>

      <main className="flex flex-1 justify-center px-4 pt-12">
        <div className="w-full max-w-[700px] space-y-8">
          <h1 className="font-serif text-[28px] font-medium tracking-tight text-foreground">
            Confirm the client
          </h1>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              Client on the joint account you are servicing
            </p>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger
                className="h-10 w-full border-input bg-white px-2.5 shadow-xs"
                aria-label="Select client on the joint account"
              >
                <SelectValue>
                  <span className="flex items-center gap-3">
                    <Avatar className="size-7 shrink-0 rounded-full bg-chart-6">
                      <AvatarFallback className="bg-chart-6 text-black">
                        <User className="size-4" strokeWidth={2} />
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-sm font-semibold text-foreground">
                      {selectedClient.name}
                    </span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {MOCK_CLIENTS.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <span className="flex items-center gap-3">
                      <Avatar className="size-7 shrink-0 rounded-full bg-chart-6">
                        <AvatarFallback className="bg-chart-6 text-black">
                          <User className="size-4" strokeWidth={2} />
                        </AvatarFallback>
                      </Avatar>
                      {client.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </main>

      <div className="shrink-0 border-t border-border bg-white p-[10px]">
        <div className="flex justify-center">
          <Button
            className="h-10 min-w-[72px] bg-black px-8 text-sm font-medium text-white hover:bg-black/90"
            onClick={() => {
              router.push(`${disbursementPath}?client=${encodeURIComponent(selectedClient.name)}`)
            }}
            aria-label="Start outbound transfer"
          >
            Start
          </Button>
        </div>
      </div>
    </div>
  )
}
