'use client';

import { RefreshCw } from 'lucide-react';

interface LastUpdatedProps {
  timestamp: string;
  onRefresh?: () => void;
  className?: string;
  showBorder?: boolean;
}

export function LastUpdated({ 
  timestamp, 
  onRefresh, 
  className = "",
  showBorder = true 
}: LastUpdatedProps) {
  return (
    <div className={`flex items-center gap-1.5 pt-3 ${showBorder ? 'border-t' : ''} ${className}`}>
      <span className="text-xs text-muted-foreground">{timestamp}</span>
      <button 
        className="w-6 h-6 rounded-md border hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer flex items-center justify-center"
        onClick={onRefresh || (() => {})}
      >
        <RefreshCw className="w-3 h-3" />
      </button>
    </div>
  );
}
