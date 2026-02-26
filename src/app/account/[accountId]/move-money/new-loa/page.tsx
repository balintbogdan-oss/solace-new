'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { User } from 'lucide-react'
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

const CLIENTS = [
  { id: '1', name: 'Jim Robinson' },
  { id: '2', name: 'Alexa Robinson' },
]

export default function NewLoaConfirmClientPage() {
  const router = useRouter()
  const params = useParams()
  const accountId = params?.accountId as string

  const loaDetailsPath = `/account/${accountId}/move-money/new-loa/details`

  const [selectedClientId, setSelectedClientId] = useState(CLIENTS[0].id)

  return (
    <div className="fixed inset-0 z-20 flex flex-col bg-white">
      <HeaderMoneyMovement hideStepper />

      <main className="flex flex-1 justify-center overflow-y-auto px-4 py-10">
        <div className="w-full max-w-[700px] space-y-8 pb-10">
          <div className="space-y-1">
            <h1 className="font-serif text-[28px] font-medium leading-[48px] tracking-tight text-foreground">
              Confirm the client
            </h1>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              Client on the joint account you are servicing
            </p>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger className="h-10 w-full border-input bg-white px-3 shadow-xs">
                <SelectValue>
                  <span className="flex items-center gap-2">
                    <Avatar className="size-7 shrink-0 rounded-full bg-chart-6">
                      <AvatarFallback className="bg-chart-6 text-black">
                        <User className="size-4" strokeWidth={2} />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-semibold text-foreground">
                      {CLIENTS.find((c) => c.id === selectedClientId)?.name}
                    </span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {CLIENTS.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <span className="flex items-center gap-2">
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
        <div className="flex items-center justify-center">
          <Button
            className="h-10 bg-black px-8 text-sm font-medium text-white hover:bg-black/90"
            onClick={() => router.push(loaDetailsPath)}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
