'use client'

import { User, ChevronRight, PiggyBank, CalendarClock, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

// Interface for an action item
interface ActionItem {
  title: string;
  icon: React.ElementType;
  href: string;
}

const actionItems: ActionItem[] = [
  {
    title: "View recent activity",
    icon: User,
    href: "/clients/activity", // Example path
  },
  {
    title: "Identify idle cash",
    icon: PiggyBank,
    href: "/clients/idle-cash",
  },
  {
    title: "See upcoming reviews",
    icon: CalendarClock,
    href: "/clients/reviews",
  },
  {
    title: "Needs attention",
    icon: UserCheck,
    href: "/clients/attention",
  },
];

export function ClientsWidget() {
  // Removed unused displayedClients variable
  // const displayedClients = MOCK_CLIENTS.slice(0, 4);
  const totalClients = 194; // Keep hardcoded count

  return (
    <div className="grid grid-cols-3 gap-6 h-full">
      {/* Left Column: Client Count & Buttons */}
      <div className="col-span-1 flex flex-col justify-between">
        <div>
          <div className="text-sm font-medium text-muted-foreground">Total clients</div>
          <h2 
            className="text-5xl font-medium text-foreground mt-2"
          >
            {totalClients}
          </h2>
        </div>
        {/* Buttons added here */}
        <div className="flex flex-col space-y-2">
          <Button variant="default" className="w-full">Create client</Button>
          <Button variant="outline" className="w-full">See all</Button>
        </div>
      </div>

      {/* Right Column: Action Items */}
      <div className="col-span-2">
        <div className="space-y-3">
          {actionItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="block p-4 rounded-lg border border-gray-200 dark:border-primary/20 border-l-4 border-l-primary transition-colors group hover:bg-muted/60"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{item.title}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 