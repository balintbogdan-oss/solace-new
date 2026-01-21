'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RepOfficeSwitcherProps {
  selectedValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

// Mock data for rep/office codes
const repOfficeOptions = [
  { value: 'all', label: 'All' },
  { value: 'rep001', label: 'Rep 001 - John Smith' },
  { value: 'rep002', label: 'Rep 002 - Jane Doe' },
  { value: 'rep003', label: 'Rep 003 - Mike Johnson' },
  { value: 'office001', label: 'Office 001 - Main Branch' },
  { value: 'office002', label: 'Office 002 - Downtown' },
  { value: 'office003', label: 'Office 003 - Suburbs' },
];

export function RepOfficeSwitcher({ 
  selectedValue = 'all', 
  onValueChange,
  className 
}: RepOfficeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = repOfficeOptions.find(option => option.value === selectedValue) || repOfficeOptions[0];

  const handleSelect = (value: string) => {
    onValueChange?.(value);
    setIsOpen(false);
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Shield Icon */}
      <div className="w-8 h-8 rounded-full bg-amber-600 dark:bg-amber-700 flex items-center justify-center flex-shrink-0">
        <Shield className="h-4 w-4 text-white" />
      </div>
      
      {/* Label */}
      <span className="font-semibold text-sm text-gray-900 dark:text-white">
        Rep/Office codes
      </span>
      
      {/* Dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-8 px-3 py-1 bg-stone-50 dark:bg-stone-900 border-amber-600 dark:border-amber-700 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md"
          >
            <span className="font-semibold text-sm text-gray-900 dark:text-white">
              {selectedOption.label}
            </span>
            <ChevronDown className="h-4 w-4 ml-2 text-gray-900 dark:text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          {repOfficeOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => handleSelect(option.value)}
              className="cursor-pointer"
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
