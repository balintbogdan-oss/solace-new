'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Info, MoreVertical, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Widget, WidgetHeader } from '@/components/widgets/types';

// Time period definitions (local to this component)
const TIME_PERIODS = ['1D', '1W', '1M', '6M', 'YTD', '1Y'] as const;
type TimePeriod = typeof TIME_PERIODS[number];

// Added Commission type definitions
const COMMISSION_TYPES = ['Net', 'Gross'] as const;
type CommissionType = typeof COMMISSION_TYPES[number];

// Defined DropIndicator type locally
interface DropIndicator {
  widgetId: string;
  position: 'before' | 'after';
}

// Define potential props passed down to widget components
interface WidgetComponentProps {
  activeView?: 'action_required' | 'all_alerts';
  commissionViewType?: CommissionType;
  selectedPeriod?: TimePeriod;
}

// Props interface for SortableWidget itself
export interface SortableWidgetProps {
  id: string;
  widget: Widget;
  dropIndicator: DropIndicator | null;
  onRemove: (id: string) => void;
  headerControls?: React.ReactNode;
  activeComplianceView?: 'action_required' | 'all_alerts';
  onComplianceViewChange?: (view: 'action_required' | 'all_alerts') => void;
}

// SortableWidget component definition
export default function SortableWidget({ id, widget, onRemove, dropIndicator, headerControls, activeComplianceView, onComplianceViewChange }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // State for TimeFrame switcher (used by AUM/Activity)
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1Y');
  // State for Commission Type switcher (used by Commission) - Updated type
  const [selectedCommissionType, setSelectedCommissionType] = useState<CommissionType>("Net");

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  const Component = widget.component;

  const showIndicatorBefore = dropIndicator?.widgetId === id && dropIndicator.position === 'before';
  const showIndicatorAfter = dropIndicator?.widgetId === id && dropIndicator.position === 'after';

  // Props to pass down (specific view/period props)
  const componentProps: WidgetComponentProps = {}; 

  // Add conditional props
  if (widget.id === 'compliance' && activeComplianceView) {
    componentProps.activeView = activeComplianceView;
  }
  if (widget.id === 'commission') {
    componentProps.commissionViewType = selectedCommissionType;
  }
  if (widget.id === 'aum' || widget.id === 'activity') {
    componentProps.selectedPeriod = selectedPeriod;
  }

  // Construct the required header object
  const widgetHeader: WidgetHeader = {
    title: widget.title,
    value: '' // Placeholder value
  };

  // Calculate counts for switcher buttons (needs access to data source or passed props)
  // Placeholder counts for now
  const actionRequiredCount = 3; 
  const allAlertsCount = 5; 

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative touch-none"
      data-id={id}
      {...attributes}
      // {...listeners} // Apply listeners only to the grip handle area
    >
      {showIndicatorBefore && (
        <div className="absolute top-0 left-[-8px] bottom-0 w-1 bg-blue-500 rounded-full z-10" />
      )}

      <Card 
        className="h-[400px] p-6  transform transition-all duration-200 hover:scale-[1.01]"
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between mb-2 shrink-0">
            {/* Left side: Grip and Title */}
            {/* Apply listeners only to this div for dragging */}
            <div {...listeners} className="flex items-center gap-2 cursor-move">
             
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <div className="text-sm font-medium text-muted-foreground truncate">{widget.title}</div>
                  {/* Conditionally render Info icon only for commission widget */}
                  {widget.id === 'commission' && (
                    <Info className="h-4 w-4 text-gray-400 shrink-0" />
                  )}
                </div>
              </div>
            </div>
            
            {/* Right side: Dynamic Controls and Options */}
            <div className="flex items-center space-x-2">
              {/* Render provided headerControls first if they exist */}
              {headerControls}

              {/* Conditionally render BUILT-IN controls based on widget ID */}
              {(widget.id === 'aum' || widget.id === 'activity') && (
                <div className="flex items-center bg-muted p-1 rounded-md space-x-1">
                  {TIME_PERIODS.map((period) => (
                    <Button
                      key={period}
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPeriod(period);
                      }}
                      className={`px-2.5 h-7 text-sm  ${selectedPeriod === period ? 'bg-neutral-200 dark:bg-neutral-800' : ''}`}
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              )}

              {widget.id === 'commission' && (
                 <div className="flex items-center bg-muted p-1 rounded-md space-x-1">
                   {COMMISSION_TYPES.map((type) => (
                     <Button
                       key={type}
                       variant="ghost"
                       onClick={(e) => {
                         e.stopPropagation();
                         setSelectedCommissionType(type);
                       }}
                       className={`px-2.5 h-7 text-sm  ${selectedCommissionType === type ? 'bg-neutral-200 dark:bg-neutral-800' : ''}`}
                     >
                       {type}
                     </Button>
                   ))}
                 </div>
              )}

              {/* Render compliance switcher IF id is compliance and callback exists */}
              {widget.id === 'compliance' && onComplianceViewChange && activeComplianceView && (
                 <div className="inline-flex items-center space-x-1 bg-muted p-1 rounded-md">
                    <Button
                      variant="ghost"
                      onClick={(e) => { e.stopPropagation(); onComplianceViewChange('action_required'); }}
                      className={`px-3 h-7 text-xs text-black ${activeComplianceView === 'action_required' ? 'bg-gray-200' : ''}`}
                    >
                      Action Required ({actionRequiredCount})
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={(e) => { e.stopPropagation(); onComplianceViewChange('all_alerts'); }}
                      className={`px-3 h-7 text-xs text-black ${activeComplianceView === 'all_alerts' ? 'bg-gray-200' : ''}`}
                    >
                      All Alerts ({allAlertsCount})
                    </Button>
                  </div>
              )}

              {/* Options Dropdown (Common to all) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    className="text-red-600 dark:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation(); // Also stop propagation here
                      onRemove(id)
                    }}
                  >
                    Remove widget
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="flex-1 min-h-0 overflow-hidden">
            {/* Pass the required header and other conditional props */}
            <Component header={widgetHeader} {...componentProps} />
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-white/10 shrink-0">
            <div className="text-xs text-gray-500 truncate">
              Updated 09/22/2025 3:35 PM ET
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
          </div>
        </div>
      </Card>

      {showIndicatorAfter && (
        <div className="absolute top-0 right-[-8px] bottom-0 w-1 bg-blue-500 rounded-full z-10" />
      )}
    </div>
  );
} 