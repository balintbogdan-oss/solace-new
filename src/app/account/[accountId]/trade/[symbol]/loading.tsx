import { Card } from '@/components/ui/card'

export default function TradeDetailPageLoading() {
  return (
    <div className="flex flex-col sm:flex-row gap-8 rounded-md">
      {/* Main Content Card Skeleton */}
      <Card className="relative flex-grow p-6">
        {/* Security Header Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-8 w-24 bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-28 bg-muted rounded animate-pulse"></div>
              <div className="h-9 w-9 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex space-x-8 border-b mt-4 mb-2">
          <div className="h-6 w-20 bg-muted rounded animate-pulse"></div>
          <div className="h-6 w-20 bg-muted rounded animate-pulse"></div>
        </div>

        {/* Content Area Skeleton */}
        <div className="mt-8 space-y-6">
          {/* Chart/Stats Section Skeleton */}
          <div className="h-64 bg-muted rounded animate-pulse"></div>
          
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                <div className="h-6 w-24 bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Table/Additional Content Skeleton */}
          <div className="space-y-2">
            <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
            <div className="h-48 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      </Card>

      {/* Right Sidebar Skeleton */}
      <div className="sm:w-[400px] h-full flex-shrink-0">
        <div className="h-full flex items-center justify-center p-6 border border-dashed border-gray-400 dark:border-gray-700 rounded-lg min-h-[500px]">
          <div className="text-center">
            <div className="h-8 w-8 bg-muted rounded animate-pulse mx-auto mb-2"></div>
            <div className="h-4 w-48 bg-muted rounded animate-pulse mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

