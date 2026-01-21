'use client';

import { Card } from '@/components/ui/card';
import { ArrowRight, X, Newspaper, BarChart3 } from 'lucide-react';

interface RightColumnWidgetsProps {
  onAdvisorsClick: () => void;
}

export function RightColumnWidgets({ onAdvisorsClick }: RightColumnWidgetsProps) {
  return (
    <div className="w-full lg:w-[312px] space-y-6 lg:space-y-[28px] pt-6 lg:pt-[44px]">
      {/* Your advisors widget */}
      <Card 
        className="h-[132px] p-6 rounded-2xl shadow-[0px_0px_2px_1px_rgba(0,0,0,0.06)] flex flex-col justify-between overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onAdvisorsClick}
      >
        <div className="pl-1.5 py-1.5 flex flex-col justify-start items-start gap-2">
          <p className="text-sm font-medium text-muted-foreground leading-[14px]">Your advisors</p>
          <div className="inline-flex justify-center items-center">
            <p className="text-base font-medium text-foreground leading-4">Samantha C. +2 more</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button className="w-8 h-8 p-1 bg-card rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border inline-flex justify-center items-center hover:bg-muted transition-colors">
            <ArrowRight className="w-4 h-4 text-primary" />
          </button>
          <div className="p-2.5 rounded-md inline-flex justify-start items-center" style={{ backgroundColor: '#BFAC75' }}>
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.5 1.58203C7.53249 1.58203 5.9375 3.17702 5.9375 5.14453C5.9375 7.11204 7.53249 8.70703 9.5 8.70703C11.4675 8.70703 13.0625 7.11204 13.0625 5.14453C13.0625 3.17702 11.4675 1.58203 9.5 1.58203Z" fill="white"/>
              <path d="M9.50037 9.5C6.46677 9.5 4.14503 11.3178 3.20231 13.8668C2.9328 14.5956 3.11732 15.3138 3.54573 15.8244C3.96324 16.322 4.60774 16.625 5.30202 16.625H13.6987C14.393 16.625 15.0374 16.322 15.455 15.8244C15.8834 15.3138 16.0679 14.5956 15.7984 13.8668C14.8557 11.3178 12.534 9.5 9.50037 9.5Z" fill="white"/>
            </svg>
          </div>
        </div>
      </Card>

      {/* Take a quick tour widget */}
      <div className="relative h-[194px] rounded-2xl overflow-hidden p-6 flex flex-col justify-between" style={{ backgroundColor: '#c5deeb' }}>
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-[13px] flex-1">
            <h3 className="text-base font-semibold text-foreground leading-none">Take a quick tour</h3>
            <p className="text-sm font-normal text-muted-foreground leading-6">
              Quick tutorials that walk you through the platform and its key features.
            </p>
          </div>
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <button className="w-8 h-8 rounded-full border bg-card p-1 flex items-center justify-center hover:bg-muted transition-colors">
            <ArrowRight className="w-4 h-4 text-primary" />
          </button>
          <div className="bg-[#75a5bf] rounded-md p-2.5 flex items-center justify-center">
            <Newspaper className="h-[19px] w-[19px] text-white" />
          </div>
        </div>
      </div>

      {/* Wedbush Research widget */}
      <div className="relative h-[194px] rounded-2xl overflow-hidden p-6 flex flex-col justify-between" style={{ backgroundColor: '#c5ceeb' }}>
        <div className="flex flex-col gap-[13px] flex-1">
          <h3 className="text-base font-semibold text-foreground leading-none">Wedbush Research</h3>
          <p className="text-sm font-normal text-muted-foreground leading-6">
            Access our resources on investing, tailored to help you thrive.
          </p>
        </div>
        <div className="flex items-center justify-between">
          <button className="w-8 h-8 rounded-full border bg-card p-1 flex items-center justify-center hover:bg-muted transition-colors">
            <ArrowRight className="w-4 h-4 text-primary" />
          </button>
          <div className="bg-[#757bbf] rounded-md p-2.5 flex items-center justify-center">
            <BarChart3 className="h-[19px] w-[19px] text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

