'use client'

import { useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  BookCheck,
  ShieldCheck,
  ArrowRightLeft,
  BookOpenCheck,
  LayoutList,
  NotebookPen,
  Landmark,
  ChevronLeft,
  Check,
  FileText,
  Image as ImageIcon,
  X,
} from 'lucide-react'
import { HeaderMoneyMovement } from '@/components/layout/HeaderMoneyMovement'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const SIDEBAR_STEPS = [
  { id: 'read-confirm', label: 'Read & confirm', icon: BookCheck, completed: true },
  { id: 'ach-authorization', label: 'ACH authorization', icon: ShieldCheck, completed: false },
  { id: 'transfer-info', label: 'Transfer information', icon: ArrowRightLeft, completed: false },
  { id: 'review', label: 'Review', icon: BookOpenCheck, completed: false },
  { id: 'form-sent', label: 'Form sent', icon: LayoutList, completed: false },
  { id: 'instruction-notes', label: 'Instruction notes', icon: NotebookPen, completed: false },
] as const

const ACTIVE_STEP = 1

function ToggleGroup({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={cn(
            'flex h-9 items-center gap-2 rounded-md border px-5 text-sm font-medium transition-colors',
            value === opt.id
              ? 'border-[#9f6a00] bg-[#9f6a00]/10 text-foreground'
              : 'border-border bg-white text-muted-foreground'
          )}
        >
          {value === opt.id ? (
            <span className="flex size-3.5 items-center justify-center rounded-full bg-[#9f6a00]">
              <Check className="size-2 text-white" strokeWidth={3} />
            </span>
          ) : (
            <span className="size-3.5 rounded-full border border-border" />
          )}
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default function NewAchAuthorizationPage() {
  const router = useRouter()
  const params = useParams()
  const accountId = params?.accountId as string

  const detailsPath = `/account/${accountId}/move-money/new-ach/details`
  const transferInfoPath = `/account/${accountId}/move-money/new-ach/transfer-info`

  // File upload
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)

  // Bank account fields
  const [accountName, setAccountName] = useState('')
  const [routingNumber, setRoutingNumber] = useState('')
  const [institutionName, setInstitutionName] = useState('')
  const [institutionAccountNumber, setInstitutionAccountNumber] = useState('')
  const [accountType, setAccountType] = useState('')

  // Transfer type (both can be selected)
  const [inboundSelected, setInboundSelected] = useState(false)
  const [outboundSelected, setOutboundSelected] = useState(false)

  // Transfer details
  const [asRequested, setAsRequested] = useState('')
  const [recurring, setRecurring] = useState('')
  const [frequency, setFrequency] = useState('daily')
  const [transferBalanceType, setTransferBalanceType] = useState('')

  // Change of ownership
  const [changeOwnership, setChangeOwnership] = useState('')
  const [transferAccountType, setTransferAccountType] = useState('other')
  const [specifyOther, setSpecifyOther] = useState('')
  const [transferNameOf, setTransferNameOf] = useState('')
  const [fromAccountNumber, setFromAccountNumber] = useState('')
  const [inAccountNumber, setInAccountNumber] = useState('')
  const [ownershipPercentage, setOwnershipPercentage] = useState('')
  const [ownershipConfirmed, setOwnershipConfirmed] = useState(false)

  // Progressive disclosure gates
  const hasFile = uploadedFile !== null
  const hasBankFields = accountName.trim() !== '' && routingNumber.trim() !== '' && institutionName.trim() !== '' && institutionAccountNumber.trim() !== '' && accountType !== ''
  const hasTransferDirection = inboundSelected || outboundSelected
  const hasTransferDetails = asRequested !== '' && recurring !== ''
  const hasChangeOwnership = changeOwnership !== ''

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) setUploadedFile(file.name)
  }, [])

  const handleFileSelect = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.jpg,.jpeg,.png'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) setUploadedFile(file.name)
    }
    input.click()
  }, [])

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
              const Icon = isCompleted ? Check : step.icon
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
          <div className="w-full max-w-[444px] space-y-8 pb-10">
            <h1 className="font-serif text-[28px] font-medium leading-[48px] tracking-tight text-foreground">
              Automated clearing house (ACH) authorization
            </h1>

            {/* Identification information */}
            <section className="space-y-0">
              <h2 className="font-serif text-[20px] font-medium leading-8 tracking-tight text-foreground">
                Identification information
              </h2>
              <div className="space-y-1 pt-2">
                {[
                  { label: 'FA code', value: 'CA10' },
                  { label: 'Account number', value: '1PB10001' },
                  { label: 'Account name', value: 'Jim Robinson' },
                ].map((row) => (
                  <div key={row.label} className="flex h-9 items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">{row.label}</span>
                    <span className="text-sm text-foreground">{row.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Bank account information */}
            <section className="space-y-3">
              <div>
                <h2 className="font-serif text-[20px] font-medium leading-8 tracking-tight text-foreground">
                  Bank account information (Attach void check)
                </h2>
                <p className="text-sm text-muted-foreground">
                  Upload your supporting document, check or bank statement
                </p>
              </div>

              {uploadedFile ? (
                <div className="flex items-center justify-between rounded-md border border-border bg-white px-3 py-2.5 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-foreground" />
                    <FileText className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{uploadedFile}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[#ecfccb] px-2 py-0.5 text-xs font-medium text-foreground">
                      Uploaded
                    </span>
                    <button
                      type="button"
                      onClick={() => setUploadedFile(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleFileSelect}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  className="flex w-full flex-col items-center gap-1 rounded-md border border-dashed border-border bg-[#fafafa] px-6 py-6 text-center transition-colors hover:border-muted-foreground"
                >
                  <ImageIcon className="size-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop here or{' '}
                    <span className="font-medium text-[#9f6a00]">click to upload</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPEG or PNG, PDF | Max file size (20 MB)
                  </p>
                </button>
              )}
            </section>

            {/* Bank account form fields — show after file upload */}
            {hasFile && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Name (As it appears on the account)</label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">ABA/routing number</label>
                  <input
                    type="text"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Institution name</label>
                  <input
                    type="text"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Institution account number</label>
                  <input
                    type="text"
                    value={institutionAccountNumber}
                    onChange={(e) => setInstitutionAccountNumber(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-sm font-medium text-foreground">Account type</span>
                  <ToggleGroup
                    options={[
                      { id: 'checking', label: 'Checking' },
                      { id: 'saving', label: 'Saving' },
                    ]}
                    value={accountType}
                    onChange={setAccountType}
                  />
                </div>
              </div>
            )}

            {/* Type of transfer — show after bank fields are complete */}
            {hasFile && hasBankFields && (
              <section className="space-y-4">
                <div>
                  <h2 className="font-serif text-[20px] font-medium leading-8 tracking-tight text-foreground">
                    Type of transfer
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    I/we elect to make transfers on-demand between my/our Wedbush
                    securities account and bank account as follows (Both can be
                    selected).
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Inbound</p>
                  <button
                    type="button"
                    onClick={() => setInboundSelected((v) => !v)}
                    className={cn(
                      'flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors',
                      inboundSelected
                        ? 'border-muted-foreground bg-[#f5f5f4]'
                        : 'border-border bg-white'
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm border shadow-sm',
                        inboundSelected
                          ? 'border-[#9f6a00] bg-[#9f6a00]'
                          : 'border-input bg-white'
                      )}
                    >
                      {inboundSelected && (
                        <Check className="size-3 text-white" strokeWidth={3} />
                      )}
                    </span>
                    <div className="space-y-0.5 text-sm text-muted-foreground">
                      <p><strong className="text-foreground">From:</strong> Bank account (specified above)</p>
                      <p><strong className="text-foreground">To:</strong> Wedbush securities account</p>
                    </div>
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Outbound</p>
                  <button
                    type="button"
                    onClick={() => setOutboundSelected((v) => !v)}
                    className={cn(
                      'flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors',
                      outboundSelected
                        ? 'border-muted-foreground bg-[#f5f5f4]'
                        : 'border-border bg-white'
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm border shadow-sm',
                        outboundSelected
                          ? 'border-[#9f6a00] bg-[#9f6a00]'
                          : 'border-input bg-white'
                      )}
                    >
                      {outboundSelected && (
                        <Check className="size-3 text-white" strokeWidth={3} />
                      )}
                    </span>
                    <div className="space-y-0.5 text-sm text-muted-foreground">
                      <p><strong className="text-foreground">From:</strong> Wedbush securities account</p>
                      <p><strong className="text-foreground">To:</strong> Bank account (specified above)</p>
                    </div>
                  </button>
                </div>
              </section>
            )}

            {/* Transfer details — show after transfer direction is selected */}
            {hasFile && hasBankFields && hasTransferDirection && (
              <>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">As requested transfers?</p>
                  <ToggleGroup
                    options={[{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'No' }]}
                    value={asRequested}
                    onChange={setAsRequested}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Recurring transfer?</p>
                  <ToggleGroup
                    options={[{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'No' }]}
                    value={recurring}
                    onChange={setRecurring}
                  />
                </div>

                {recurring === 'yes' && (
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Frequency</label>
                      <Select value={frequency} onValueChange={setFrequency}>
                        <SelectTrigger className="h-10 w-full border-input bg-white shadow-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['daily', 'weekly', 'bi-weekly', 'monthly', 'quarterly'].map((f) => (
                            <SelectItem key={f} value={f}>
                              {f.charAt(0).toUpperCase() + f.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Beginning date</label>
                      <input
                        type="text"
                        placeholder="MM/DD/YYYY"
                        className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <ToggleGroup
                    options={[
                      { id: 'interne-balance', label: 'Interne balance' },
                      { id: 'free-credit', label: 'Free credit' },
                    ]}
                    value={transferBalanceType}
                    onChange={setTransferBalanceType}
                  />
                </div>
              </>
            )}

            {/* Change of ownership — show after transfer details */}
            {hasFile && hasBankFields && hasTransferDirection && hasTransferDetails && (
              <>
                <hr className="border-border" />

                <section className="space-y-5">
                  <h2 className="font-serif text-[20px] font-medium leading-8 tracking-tight text-foreground">
                    Change of ownership
                  </h2>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">Requiring change of ownership?</p>
                    <ToggleGroup
                      options={[{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'No' }]}
                      value={changeOwnership}
                      onChange={setChangeOwnership}
                    />
                  </div>

                  {changeOwnership === 'yes' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Transfer from account type</label>
                        <Select value={transferAccountType} onValueChange={setTransferAccountType}>
                          <SelectTrigger className="h-10 w-full border-input bg-white shadow-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {['individual', 'joint', 'trust', 'corporate', 'other'].map((t) => (
                              <SelectItem key={t} value={t}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {transferAccountType === 'other' && (
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-foreground">Specify other</label>
                          <input
                            type="text"
                            value={specifyOther}
                            onChange={(e) => setSpecifyOther(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                          />
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Transfer in the name of</label>
                        <input
                          type="text"
                          value={transferNameOf}
                          onChange={(e) => setTransferNameOf(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">From the account number</label>
                        <input
                          type="text"
                          value={fromAccountNumber}
                          onChange={(e) => setFromAccountNumber(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">In the account number</label>
                        <input
                          type="text"
                          value={inAccountNumber}
                          onChange={(e) => setInAccountNumber(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Ownership percentage of assets</label>
                        <input
                          type="text"
                          value={ownershipPercentage}
                          onChange={(e) => setOwnershipPercentage(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => setOwnershipConfirmed((v) => !v)}
                        className={cn(
                          'flex w-full items-start gap-4 rounded-lg border px-4 py-6 text-left shadow-xs transition-colors',
                          ownershipConfirmed
                            ? 'border-muted-foreground bg-accent'
                            : 'border-border bg-white'
                        )}
                      >
                        <span
                          className={cn(
                            'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm border shadow-sm',
                            ownershipConfirmed
                              ? 'border-[#9f6a00] bg-[#9f6a00]'
                              : 'border-input bg-white'
                          )}
                        >
                          {ownershipConfirmed && (
                            <Check className="size-3 text-white" strokeWidth={3} />
                          )}
                        </span>
                        <span className="text-sm leading-6 text-foreground">
                          I confirm that transferring funds as specified will
                          relinquish ownership % as specified of those assets.
                        </span>
                      </button>
                    </>
                  )}
                </section>
              </>
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
            onClick={() => router.push(detailsPath)}
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>
          <Button
            className="h-10 bg-black px-8 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-50"
            disabled={!hasFile || !hasBankFields || !hasTransferDirection || !hasTransferDetails || !hasChangeOwnership}
            onClick={() => router.push(transferInfoPath)}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
