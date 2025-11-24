'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useUserRole } from '@/contexts/UserRoleContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  DragOverEvent,
} from '@dnd-kit/core';
import { Card } from '@/components/ui/card';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';
import { availableWidgets } from '@/components/widgets/registry';
import { Widget } from '@/components/widgets/types';
import { WidgetCustomizer } from '@/components/widgets/WidgetCustomizer';
import SortableWidget from '@/components/layout/SortableWidget';

// Updated Mock Ticker Data from image
const allTickers = [
  { symbol: 'S&P 500', value: '5,915.64', change: '+0.71%', changeType: 'positive' },
  { symbol: 'DJI', value: '13,221.90', change: '-0.61%', changeType: 'negative' },
  { symbol: 'Nasdaq', value: '19,913.50', change: '-1.08%', changeType: 'negative' },
  { symbol: 'Russell 2000', value: '21,636.92', change: '-1.67%', changeType: 'negative' },
  { symbol: 'Crude Oil', value: '70.92', change: '+1.11%', changeType: 'positive' },
  { symbol: 'Gold', value: '2,884.60', change: '+1.11%', changeType: 'positive' },
  // Add more if needed to reach 9 for rotation, repeating for now
  { symbol: 'S&P 500', value: '5,915.64', change: '+0.71%', changeType: 'positive' },
  { symbol: 'DJI', value: '13,221.90', change: '-0.61%', changeType: 'negative' },
  { symbol: 'Nasdaq', value: '19,913.50', change: '-1.08%', changeType: 'negative' },
];

// Client-only wrapper for DnD functionality
const DashboardGrid = dynamic(() => Promise.resolve(({ children }: { children: React.ReactNode }) => <>{children}</>), {
  ssr: false
});

interface DropIndicator {
  widgetId: string;
  position: 'before' | 'after';
}

interface WidgetLayoutItem {
  id: string;
  widget: Widget;
  width: '1/3' | '1/2' | '1/1';
  row: number;
}

// Helper to map width to a numerical value for calculation (1/3 -> 1, 1/2 -> 1.5, 1/1 -> 3)
const widthToUnits = (width: '1/3' | '1/2' | '1/1'): number => {
  if (width === '1/1') return 3;
  if (width === '1/2') return 1.5;
  return 1; // 1/3 width
};

// Helper function to recalculate rows based on widths
function calculateLayout(items: WidgetLayoutItem[]): WidgetLayoutItem[] {
  const newLayout: WidgetLayoutItem[] = [];
  let currentRow = 0;
  let currentWidthSum = 0;
  const maxUnitsPerRow = 3;

  items.forEach(item => {
    const itemUnits = widthToUnits(item.width);

    // If adding this item exceeds the row capacity, move to the next row
    if (currentWidthSum > 0 && currentWidthSum + itemUnits > maxUnitsPerRow) {
      currentRow++;
      currentWidthSum = 0;
    }

    newLayout.push({ ...item, row: currentRow });
    currentWidthSum += itemUnits;
  });

  return newLayout;
}

export default function DashboardPage() {
  const router = useRouter();
  const { role, isHydrated } = useUserRole();
  
  // All hooks must be called before any conditional returns
  const [isSimpleMode, setIsSimpleMode] = useState(true); // State for dashboard mode, default to true
  const [complianceView, setComplianceView] = useState<'action_required' | 'all_alerts'>('action_required'); // State for compliance widget
  const [layoutItems, setLayoutItems] = useState<WidgetLayoutItem[]>(() => {
    const defaultWidgets = availableWidgets.filter(w => w.defaultEnabled);
    // Debug: Log if no widgets are found
    if (defaultWidgets.length === 0) {
      console.warn('No widgets with defaultEnabled=true found. Available widgets:', availableWidgets.length);
    }
    const initialItems: WidgetLayoutItem[] = defaultWidgets.map((widget): WidgetLayoutItem => {
      // Assign specific widths
      if ([ 'compliance', 'clients', 'commission', 'aum'].includes(widget.id)) {
        return { id: widget.id, widget, width: '1/2', row: 0 };
      }
      // Default other widgets (including recently-viewed) to 1/3
      return { id: widget.id, widget, width: '1/3', row: 0 };
    });
    return calculateLayout(initialItems);
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // --- Ticker State and Logic ---
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTickerIndex((prevIndex) => (prevIndex + 3) % allTickers.length);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // Redirect clients to client dashboard (unless they're on an account page)
  useEffect(() => {
    if (isHydrated && role === 'client') {
      const pathname = window.location.pathname;
      // Don't redirect if already on client-dashboard or on an account page
      if (!pathname.startsWith('/client-dashboard') && !pathname.startsWith('/account/')) {
        router.push('/client-dashboard');
      }
    }
  }, [role, isHydrated, router]);

  // Filter items based on mode (must be before early return)
  const itemsToRender = isSimpleMode ? layoutItems.filter(item => item.id !== 'recently-viewed') : layoutItems;
  
  // Recalculate layout based on filtered items (must be before early return)
  const currentLayout = useMemo(() => calculateLayout(itemsToRender), [itemsToRender]);

  // Don't render advisor dashboard for clients
  if (isHydrated && role === 'client') {
    return null;
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    const element = document.querySelector(`[data-id="${active.id}"]`);
    if (element) {
      element.classList.add('opacity-50');
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setDropIndicator(null);
      return;
    }
    const overElement = document.querySelector(`[data-id="${over.id}"]`);
    if (!overElement) return;
    const rect = overElement.getBoundingClientRect();
    const mouseX = (event.activatorEvent as MouseEvent).clientX;
    const relativeX = mouseX - rect.left;
    const threshold = rect.width * 0.4;
    if (relativeX < threshold) {
      setDropIndicator({ widgetId: over.id as string, position: 'before' });
    } else if (relativeX > rect.width - threshold) {
      setDropIndicator({ widgetId: over.id as string, position: 'after' });
    } else {
      setDropIndicator(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    const element = document.querySelector(`[data-id="${active.id}"]`);
    if (element) {
      element.classList.remove('opacity-50');
    }

    setActiveId(null);
    setDropIndicator(null);

    if (!over || active.id === over.id) return;

    setLayoutItems((items) => {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      
      if (oldIndex === -1 || newIndex === -1) return items;

      const movedItems = arrayMove(items, oldIndex, newIndex); 
      
      // Recalculate layout based on new order
      return calculateLayout(movedItems);
    });
  };

  const handleRemoveWidget = (id: string) => {
    setLayoutItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== id);
      // Recalculate layout after removal
      return calculateLayout(newItems);
    });
  };

  const handleWidgetsChange = (newWidgets: Widget[]) => {
    // Explicitly type the return value of the map callback
    const newItems: WidgetLayoutItem[] = newWidgets.map((widget): WidgetLayoutItem => {
      const existing = layoutItems.find(li => li.id === widget.id);
      const width: '1/3' | '1/2' | '1/1' = existing?.width || '1/3'; 
      return { 
        id: widget.id, 
        widget, 
        width: width, 
        row: 0 // Temporary row, will be recalculated
      };
    });
    // Now newItems should be correctly typed
    setLayoutItems(calculateLayout(newItems));
  };

  // --- Ticker State and Logic ---
  const displayedTickers = allTickers.slice(tickerIndex, tickerIndex + 3);

  const tickerVariants = {
    enter: {
      y: 10, // Start from slightly below
      opacity: 0
    },
    center: {
      zIndex: 1,
      y: 0, // Center vertically
      opacity: 1
    },
    exit: {
      zIndex: 0,
      y: -10, // Exit slightly upwards
      opacity: 0
    }
  };
  // --- End Ticker State and Logic ---

  const toggleDashboardMode = () => {
    setIsSimpleMode(prev => !prev);
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="space-y-4">
        <div className="flex justify-between items-center h-10">
          <h1 
            className="text-2xl text-gray-900 dark:text-white cursor-pointer"
            onClick={toggleDashboardMode}
          >
             Good morning, David
          </h1>
          <div className="flex items-center space-x-4">
            {!isSimpleMode && (
              <div className="flex items-center h-10 overflow-hidden relative">
                <AnimatePresence initial={false} mode="wait">
                  <motion.div 
                    key={tickerIndex} 
                    className="flex" 
                    variants={tickerVariants} 
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.5 }}
                  >
                    {displayedTickers.map((ticker) => (
                      <motion.div
                        key={ticker.symbol} 
                        className="flex items-center space-x-2 px-3 whitespace-nowrap justify-center" 
                      >
                        <span className="text-sm font-medium text-foreground">{ticker.symbol}</span>
                        <span className="text-sm text-muted-foreground">{ticker.value}</span>
                        <span className={`text-sm ${ticker.changeType === 'positive' ? 'text-positive' : 'text-negative'}`}>
                          {ticker.change}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
            <WidgetCustomizer
              availableWidgets={availableWidgets}
              enabledWidgets={currentLayout.map(item => item.widget)}
              onWidgetsChange={handleWidgetsChange}
            />
          </div>
        </div>
        
        <DashboardGrid>
          {currentLayout.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <p className="text-lg mb-2">No widgets enabled</p>
                <p className="text-sm">Click &quot;+ Customize widgets&quot; to add widgets to your dashboard</p>
              </div>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={currentLayout.map(item => item.id)}
                strategy={rectSortingStrategy}
              >
                {[...new Set(currentLayout.map(item => item.row))].sort((a, b) => a - b).map(row => (
                  <div key={row} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
                    {currentLayout.filter(item => item.row === row).map(item => {
                      const widthClass = item.width === '1/1' ? 'xl:col-span-6' : 
                                       item.width === '1/2' ? 'xl:col-span-3' : 
                                       'xl:col-span-2';
                      const mdWidthClass = item.width === '1/1' ? 'md:col-span-2' : 'md:col-span-1';
                      
                      // Determine if this is the Compliance widget
                      const isComplianceWidget = item.id === 'compliance';

                      return (
                        <div key={item.id} className={`${mdWidthClass} ${widthClass}`}> 
                          <SortableWidget
                            id={item.id}
                            widget={item.widget}
                            onRemove={handleRemoveWidget}
                            dropIndicator={dropIndicator}
                            activeComplianceView={isComplianceWidget ? complianceView : undefined}
                            onComplianceViewChange={isComplianceWidget ? setComplianceView : undefined}
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </SortableContext>
            </DndContext>
          )}
          
          {currentLayout.length > 0 && (
            <DragOverlay>
              {activeId ? (
                <Card className="p-6 bg-card border rounded-2xl shadow-lg">
                   {/* Correctly render the component for the overlay, passing minimal header */}
                   {(() => {
                      const widgetDefinition = layoutItems.find(item => item.id === activeId)?.widget;
                      // Use the component type directly from definition (now any)
                      const ActiveWidgetComponent = widgetDefinition?.component; 
                      
                      const placeholderHeader = {
                         title: widgetDefinition?.title || 'Dragging...',
                         value: '' 
                      }; 
                      // Render only if the component exists
                      return ActiveWidgetComponent ? <ActiveWidgetComponent header={placeholderHeader} /> : null;
                   })()}
                </Card>
              ) : null}
            </DragOverlay>
          )}
        </DashboardGrid>
      </div>
    </div>
  );
}
