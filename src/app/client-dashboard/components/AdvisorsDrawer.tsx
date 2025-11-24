'use client';

import { X, Mail, Phone, MapPin, Building, ChevronDown } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';
import { useState } from 'react';

interface AdvisorsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdvisorsDrawer({ isOpen, onOpenChange }: AdvisorsDrawerProps) {
  const [isSamanthaAccountsExpanded, setIsSamanthaAccountsExpanded] = useState(false);

  return (
    <Drawer direction="right" open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="h-full w-full max-w-[512px] flex flex-col bg-card shadow-xl">
        <div className="px-6 py-8 flex flex-col gap-8 overflow-y-auto">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1.5">
              <DrawerTitle className="text-xl font-medium text-foreground">Contact your advisors</DrawerTitle>
            </div>
            <DrawerClose asChild>
              <button className="w-9 h-9 p-0.5 bg-card rounded-lg border flex justify-center items-center hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-foreground" />
              </button>
            </DrawerClose>
          </div>

          <div className="flex-1 flex flex-col gap-8">
            <div className="flex flex-col gap-8">
              {/* First Advisor - Samantha Clement */}
              <div className="flex gap-8 items-start">
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-800 flex items-center justify-center">
                      <span className="text-card text-sm font-semibold">S</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 p-1 bg-amber-500 rounded-lg shadow-sm flex items-center">
                      <div className="w-2 h-2 bg-card rounded-full" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-center text-sm font-normal text-foreground">
                      Samantha<br/>Clement
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-3 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-foreground flex-shrink-0" />
                    <a href="mailto:samanthaclement@wedbush.com" className="text-sm font-medium text-primary hover:underline truncate">
                      samanthaclement@wedbush.com
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-foreground flex-shrink-0" />
                    <span className="text-sm text-foreground">(229) 555-0109</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-foreground flex-shrink-0" />
                    <span className="text-sm text-foreground">Chicago, IL</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-foreground flex-shrink-0" />
                    <span className="text-sm text-foreground">Managing 4 accounts</span>
                    <button 
                      onClick={() => setIsSamanthaAccountsExpanded(!isSamanthaAccountsExpanded)}
                      className="ml-auto h-9 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-muted transition-colors"
                    >
                      <span className="text-sm font-medium text-primary">
                        {isSamanthaAccountsExpanded ? 'Hide details' : 'Show details'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-primary transition-transform ${isSamanthaAccountsExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Accounts List */}
              {isSamanthaAccountsExpanded && (
                <div className="p-3 bg-muted rounded-2xl flex flex-col gap-3">
                  <div className="flex flex-col gap-2 overflow-hidden">
                    <div className="p-2 border-b border flex items-center gap-2">
                      <div className="flex-1 text-center text-xs font-medium text-muted-foreground">Accounts</div>
                      <div className="flex-1 text-right text-xs font-medium text-muted-foreground">Total account value</div>
                    </div>

                    <div className="flex flex-col">
                      <div className="p-2 flex items-start gap-4">
                        <div className="w-8 h-8 p-2 bg-chart-1 rounded-2xl flex items-center justify-center">
                          <Building className="w-4 h-4 text-foreground" />
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="text-sm font-medium text-foreground">Personal trust</div>
                          <div className="text-sm text-muted-foreground">35337168 • Jim</div>
                        </div>
                        <div className="flex-1 max-w-40 flex flex-col items-end justify-center">
                          <div className="text-sm font-medium text-foreground truncate">$2,400,000.00</div>
                        </div>
                      </div>

                      <div className="h-px border-t border" />

                      <div className="p-2 flex items-start gap-4">
                        <div className="w-8 h-8 p-2 bg-chart-1 rounded-2xl flex items-center justify-center">
                          <Building className="w-4 h-4 text-foreground" />
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="text-sm font-medium text-foreground">Personal trust</div>
                          <div className="text-sm text-muted-foreground">35337122 • Jimmy and Martha rain...</div>
                        </div>
                        <div className="flex-1 max-w-40 flex flex-col items-end justify-center">
                          <div className="text-sm font-medium text-foreground truncate">$850,000.00</div>
                        </div>
                      </div>

                      <div className="h-px border-t border" />

                      <div className="p-2 flex items-start gap-4">
                        <div className="w-8 h-8 p-2 bg-chart-1 rounded-2xl flex items-center justify-center">
                          <Building className="w-4 h-4 text-foreground" />
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="text-sm font-medium text-foreground">Personal trust</div>
                          <div className="text-sm text-muted-foreground">4517168 • Tony Turner INV LONG B...</div>
                        </div>
                        <div className="flex-1 max-w-40 flex flex-col items-end justify-center">
                          <div className="text-sm font-medium text-foreground truncate">$125,000.00</div>
                        </div>
                      </div>

                      <div className="h-px border-t border" />

                      <div className="p-2 border-b border flex items-start gap-4">
                        <div className="w-8 h-8 p-2 bg-chart-1 rounded-2xl flex items-center justify-center">
                          <Building className="w-4 h-4 text-foreground" />
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="text-sm font-medium text-foreground">Personal trust</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">35337114 • Kaiya and Jim Robinson...</div>
                        </div>
                        <div className="flex-1 max-w-40 flex flex-col items-end justify-center">
                          <div className="text-sm font-medium text-foreground truncate">$1,200,000.00</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="h-px border-t border" />

              {/* Second Advisor - Raymond Clinton */}
              <div className="flex gap-8 items-start">
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="relative">
                    <div className="w-16 h-16 bg-blue-800 rounded-full overflow-hidden flex items-center justify-center">
                      <span className="text-card text-lg font-semibold">R</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 p-1 bg-amber-500 rounded-lg shadow-sm flex items-center">
                      <div className="w-2 h-2 bg-card rounded-full" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-center text-sm font-normal text-foreground">
                      Raymond<br/>Clinton
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-3 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-foreground flex-shrink-0" />
                    <a href="mailto:raymondclinton@wedbush.com" className="text-sm font-medium text-primary hover:underline truncate">
                      raymondclinton@wedbush.com
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-foreground flex-shrink-0" />
                    <span className="text-sm text-foreground">(229) 555-0109</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-foreground flex-shrink-0" />
                    <span className="text-sm text-foreground">New York, NY</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-foreground flex-shrink-0" />
                    <span className="text-sm text-foreground">Managing 1 account</span>
                    <button className="ml-auto h-9 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-muted transition-colors">
                      <span className="text-sm font-medium text-primary">See details</span>
                      <ChevronDown className="w-4 h-4 text-primary" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

