'use client';

export function ReportTableSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-muted rounded-md" />
          <div className="mt-1 h-4 w-96 bg-muted rounded-md" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-4 w-40 bg-muted rounded-md" />
          <div className="h-9 w-[180px] bg-muted rounded-md" />
          <div className="h-9 w-24 bg-muted rounded-md" />
        </div>
      </div>

      {/* Search and actions */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <div className="h-9 w-full bg-muted rounded-md" />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div className="h-9 w-24 bg-muted rounded-md" />
          <div className="h-9 w-36 bg-muted rounded-md" />
        </div>
      </div>

      {/* Table */}
      <div className="relative border rounded-md overflow-hidden">
        {/* Header */}
        <div className="bg-muted/50 p-3">
          <div className="grid grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-5 bg-muted rounded-md" />
            ))}
          </div>
        </div>
        
        {/* Rows */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border-t p-3">
            <div className="grid grid-cols-6 gap-4">
              {[...Array(6)].map((_, j) => (
                <div key={j} className="h-5 bg-muted rounded-md" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 