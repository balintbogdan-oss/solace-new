import { Card } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="rounded-md space-y-4 md:space-y-4">
      {/* Page Title Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-24 bg-muted rounded animate-pulse"></div>
        </div>
      </div>

      {/* Content Card Skeleton */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="h-6 w-48 bg-muted rounded animate-pulse"></div>
          <div className="h-64 bg-muted rounded animate-pulse"></div>
        </div>
      </Card>
    </div>
  );
}
