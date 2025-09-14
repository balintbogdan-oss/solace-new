'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClientReport, ClientReportColumn } from "@/data/types";
import { cn } from "@/lib/utils";
import { ReportTableSkeleton } from "@/components/reports/ReportTableSkeleton";
import { Search, Menu, ArrowUp, ArrowDown } from 'lucide-react';

interface ReportTableProps {
  report: ClientReport;
  className?: string;
  isLoading?: boolean;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  column: string | null;
  direction: SortDirection;
}

const formatValue = (value: string | number | boolean | null | undefined, column: ClientReportColumn): string => {
  if (value === null || value === undefined) return '-';

  if (!column.format) return String(value);

  try {
    switch (column.format.type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          ...column.format.options,
        }).format(Number(value));

      case 'number':
        return new Intl.NumberFormat('en-US', {
          ...column.format.options,
        }).format(Number(value));

      case 'phone':
        // Basic phone formatting (xxx) xxx-xxxx
        const phone = String(value).replace(/\D/g, '');
        if (phone.length === 10) {
          return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
        }
        return String(value);

      case 'date':
        // Use a consistent date format to prevent hydration mismatches
        const date = new Date(String(value));
        return date.toISOString().split('T')[0]; // YYYY-MM-DD format

      default:
        return String(value);
    }
  } catch (error) {
    console.error('Error formatting value:', error);
    return String(value);
  }
};

export function ReportTable({ report, className, isLoading = false }: ReportTableProps) {
  const [loadingState, setLoadingState] = useState(isLoading);
  const { columns: initialColumns, data, options = {} } = report;
  const {
    showSearch = true,
    showColumnCustomization = true,
  } = options;

  const [showRightFade, setShowRightFade] = useState(true);
  const [sortState, setSortState] = useState<SortState>({ column: null, direction: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [columns, setColumns] = useState(initialColumns);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(initialColumns.map(col => col.key))
  );
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setLoadingState(isLoading);
  }, [isLoading]);

  useEffect(() => {
    const checkScroll = () => {
      if (tableWrapperRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = tableWrapperRef.current;
        setShowRightFade(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    const wrapper = tableWrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener('scroll', checkScroll);
      checkScroll();
      window.addEventListener('resize', checkScroll);

      return () => {
        wrapper.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  if (loadingState) {
    return <ReportTableSkeleton />;
  }

  const handleSort = (columnKey: string) => {
    setSortState(prev => {
      if (prev.column === columnKey) {
        if (prev.direction === 'asc') return { column: columnKey, direction: 'desc' };
        if (prev.direction === 'desc') return { column: null, direction: null };
        return { column: columnKey, direction: 'asc' };
      }
      return { column: columnKey, direction: 'asc' };
    });
  };

  const filteredData = searchQuery
    ? [...data].filter(row => {
        const searchLower = searchQuery.toLowerCase();
        return columns.some(column => {
          const value = row[column.key];
          if (value == null) return false;
          return String(value).toLowerCase().includes(searchLower);
        });
      })
    : data;

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortState.column || !sortState.direction) return 0;

    const column = columns.find(col => col.key === sortState.column);
    if (!column) return 0;

    const aValue = a[column.key];
    const bValue = b[column.key];

    if (aValue === bValue) return 0;
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    const modifier = sortState.direction === 'asc' ? 1 : -1;

    if (column.type === 'number' || column.type === 'currency') {
      const aNum = column.type === 'currency' 
        ? Number(String(aValue).replace(/[^0-9.-]+/g, ''))
        : Number(String(aValue).replace(/,/g, ''));
      const bNum = column.type === 'currency'
        ? Number(String(bValue).replace(/[^0-9.-]+/g, ''))
        : Number(String(bValue).replace(/,/g, ''));
      return (aNum - bNum) * modifier;
    }

    return String(aValue).localeCompare(String(bValue)) * modifier;
  });

  const toggleColumnVisibility = (columnKey: string) => {
    setVisibleColumns(prev => {
      const next = new Set(prev);
      if (next.has(columnKey)) {
        next.delete(columnKey);
      } else {
        next.add(columnKey);
      }
      return next;
    });
  };

  const moveColumn = (fromIndex: number, toIndex: number) => {
    setColumns(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', String(index));
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    setDragOverIndex(null);
    e.currentTarget.classList.remove('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    setIsDragging(false);
    setDragOverIndex(null);
    const fromIndex = Number(e.dataTransfer.getData('text/plain'));
    if (fromIndex !== toIndex) {
      moveColumn(fromIndex, toIndex);
    }
  };

  const visibleColumnsList = columns.filter(col => visibleColumns.has(col.key));

  const resetToDefault = () => {
    setColumns(initialColumns);
    setVisibleColumns(new Set(initialColumns.map(col => col.key)));
  };

  return (
    <div className={className}>
      <div className="mb-4">
        <div className="flex items-center justify-between ">
          {showSearch && (
            <div className="relative w-[240px] bg-white dark:bg-black rounded-md border shadow-sm">
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10 border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          )}
          
          {showColumnCustomization && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline"  className="ml-auto bg-white dark:bg-black">
                  <Menu className="h-4 w-4 mr-2" />
                  Customize columns
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[200px] bg-white/10 dark:bg-black/10 backdrop-blur-xl border-none">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">Toggle columns</p>
                  <button
                    onClick={resetToDefault}
                    className="text-sm text-primary"
                  >
                    Reset
                  </button>
                </div>
                <div className="space-y-2">
                  {columns.map((column) => (
                    <div
                      key={column.key}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={column.key}
                        checked={visibleColumns.has(column.key)}
                        onCheckedChange={() => toggleColumnVisibility(column.key)}
                      />
                      <label
                        htmlFor={column.key}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {column.header}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      <div
        ref={tableWrapperRef}
        className={cn(
          "relative  overflow-x-auto bg-white dark:bg-black rounded-md border shadow-sm",
          showRightFade && "mask-fade-right"
        )}
      >
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumnsList.map((column, index) => (
                  <TableHead
                    key={column.key}
                    style={{ width: column.width }}
                    onClick={() => handleSort(column.key)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    className={cn(
                      'relative cursor-grab active:cursor-grabbing  bg-white/10 dark:bg-white/10',
                      isDragging && 'group'
                    )}
                  >
                    <div className="flex items-center gap-2 text-black dark:text-white">
                      <span>{column.header}</span>
                      {sortState.column === column.key && (
                        sortState.direction === 'asc' ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )
                      )}
                    </div>
                    {isDragging && (
                      <div className={cn(
                        "absolute inset-y-0 left-0 w-[2px] bg-primary transition-opacity",
                        dragOverIndex === index ? "opacity-100" : "opacity-0"
                      )} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((row, i) => (
                <TableRow key={i} className="border">
                  {visibleColumnsList.map((column) => (
                    <TableCell
                      key={column.key}
                      className={cn(
                        "whitespace-nowrap",
                        column.align === 'right' && "text-right",
                        column.align === 'center' && "text-center"
                      )}
                    >
                      {formatValue(row[column.key] as string | number | boolean | null | undefined, column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
} 