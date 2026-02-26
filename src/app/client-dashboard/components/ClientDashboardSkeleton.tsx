import { Card } from '@/components/ui/card';

export function ClientDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning>
      <div className="w-full relative" style={{ backgroundColor: '#041340' }}>
        <div className="max-w-[1440px] mx-auto px-[100px] py-8 relative">
          <div className="relative z-10">
            <div className="h-8 w-64 bg-white/10 rounded animate-pulse mb-2"></div>
          </div>
        </div>
      </div>
      
      <div className="max-w-[1440px] mx-auto px-[100px] py-0">
        <div className="flex gap-8 py-6">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-7 w-32 bg-muted rounded animate-pulse"></div>
                <div className="h-5 w-32 bg-muted rounded animate-pulse"></div>
              </div>

              <div className="space-y-4">
                <Card className="overflow-hidden p-0">
                  <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div className="flex-1">
                      <div className="h-5 w-48 bg-muted rounded animate-pulse mb-2"></div>
                      <div className="h-4 w-64 bg-muted rounded animate-pulse"></div>
                    </div>
                    <div className="h-6 w-40 bg-muted rounded animate-pulse"></div>
                  </div>
                  <div className="px-6 py-4 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b">
                        <div className="flex-1">
                          <div className="h-5 w-32 bg-muted rounded animate-pulse mb-2"></div>
                          <div className="h-4 w-56 bg-muted rounded animate-pulse"></div>
                        </div>
                        <div className="h-5 w-32 bg-muted rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-7 w-40 bg-muted rounded animate-pulse"></div>
                <div className="h-9 w-32 bg-muted rounded animate-pulse"></div>
              </div>

              <Card className="rounded-2xl shadow-[0px_0px_2px_1px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="p-6 flex flex-col gap-6">
                  <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
                  <div className="flex items-start gap-16">
                    <div className="w-[200px] h-[200px] bg-muted rounded-full animate-pulse flex-shrink-0"></div>
                    <div className="flex-1 space-y-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="h-3 w-3 bg-muted rounded-full animate-pulse"></div>
                          <div className="h-5 w-24 bg-muted rounded animate-pulse"></div>
                          <div className="h-5 w-16 bg-muted rounded animate-pulse ml-auto"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="w-[312px] space-y-[28px] pt-[44px]">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-5 w-32 bg-muted rounded animate-pulse"></div>
                  <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
                </div>
                <div className="h-4 w-48 bg-muted rounded animate-pulse"></div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

