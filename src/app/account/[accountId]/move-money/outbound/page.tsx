'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { HeaderMoneyMovement } from '@/components/layout/HeaderMoneyMovement'

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

export default function OutboundConfirmClientPage() {
  const router = useRouter()
  const params = useParams()
  const accountId = params?.accountId as string
  const disbursementPath = `/account/${accountId}/move-money/outbound/disbursement`

  const [selectedClientId, setSelectedClientId] = useState(MOCK_CLIENTS[0].id)
  const selectedClient = MOCK_CLIENTS.find((c) => c.id === selectedClientId)!

  return (
    <div className="fixed inset-0 z-20 flex flex-col bg-white">
      <HeaderMoneyMovement />

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
