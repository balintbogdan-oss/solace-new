'use client';

export function PageLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="h-[54px] bg-card border-b">
        <div className="px-6 h-full flex items-center">
          <div className="h-4 w-48 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
      {/* Main Content Skeleton */}
      <div className="flex h-[calc(100vh-54px)]">
        {/* Sidebar Skeleton */}
        <div className="w-60 border-r bg-card">
          <div className="p-4 space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        {/* Content Skeleton */}
        <div className="flex-1 px-8 py-8">
          <div className="space-y-4">
            <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-64 bg-muted rounded animate-pulse"></div>
              <div className="h-64 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
