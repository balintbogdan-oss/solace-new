'use client'

import React from 'react';

interface KeyStatsProps {
  stats: Record<string, number | string>; // Accept a flexible stats object
}

export function KeyStats({ stats }: KeyStatsProps) {
  // TODO: Implement actual Key Statistics display
  return (
    <div className="p-4 border rounded-lg bg-muted/30 dark:bg-muted/10">
      <h3 className="text-sm font-semibold mb-2 text-foreground">Key Statistics</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {/* Placeholder: Render first 6 stats as an example */}
        {Object.entries(stats).slice(0, 6).map(([key, value]) => (
           <div key={key} className="flex justify-between">
             <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
             <span>{typeof value === 'number' ? value.toFixed(2) : value}</span>
           </div>
        ))}
         {Object.keys(stats).length > 6 && (
             <div className="col-span-2 text-center text-xs text-muted-foreground/70 mt-1">...</div>
         )}
      </div>
    </div>
  );
} 