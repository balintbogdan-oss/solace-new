'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import {
  UserCog,
  BarChart2,
  Link as LinkIcon,
  Book,
  Activity,
  Search
} from "lucide-react";

interface QuickActionCardProps {
  icon: React.ReactNode;
  label: string;
  category: string;
  href: string;
  className?: string;
}

function QuickActionCard({ icon, label, category, href, className }: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-start p-5 rounded-lg transition-transform hover:scale-[1.02] border ",
        "bg-card text-foreground shadow-sm",
        className
      )}
    >
      <div className="h-6 w-6 mb-2 text-yellow-600 dark:text-yellow-400">
        {icon}
      </div>
      <div className="text-sm font-medium text-foreground mb-1">{label}</div>
      <div className="text-xs text-muted-foreground">{category}</div>
    </Link>
  );
}

export default function ReportsPage() {
  const allReports = useMemo(() => [
    ['Account information changes', 'Client admin'],
    ['Bond ratings', 'Positions'],
    ['Buying power', 'Funds'],
    ['Commissions detail', 'Commissions'],
    ['Daily activity', 'Activity'],
    ['Dividend balance', 'Activity'],
    ['Margin status', 'Funds'],
    ['Maturity schedule', 'Positions'],
    ['Net money balance', 'Funds'],
  ], []);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = useMemo(() => {
    return allReports.filter(([name, category]) =>
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allReports]);

  return (
    <div className="relative ">
      <div className=" mx-auto space-y-10">


      <section>
      <h1 className="text-3xl font-serif mb-4">Reports</h1>


          <h2 className="text-lg font-medium mb-4">Recently viewed reports</h2>

          <div className="relative -mx-4 sm:mx-0 w-full">
            <div className=" sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4 flex flex-row gap-4 overflow-x-auto pb-2">
              {[
              { icon: <BarChart2 />, label: "Maturity schedule", category: "Positions", href: "/reports/positions/maturity-schedule" },
              { icon: <Book />, label: "Buying power", category: "Funds", href: "/reports/funds/buying-power" },
              { icon: <UserCog />, label: "ACH", category: "Client admin", href: "/reports/client-admin/ach" },
              { icon: <Activity />, label: "Daily activity", category: "Activity", href: "/reports/activity/daily-activity" },
              { icon: <LinkIcon />, label: "Commissions detail", category: "Commissions", href: "/reports/commissions/commissions-detail" },
              { icon: <BarChart2 />, label: "Options analysis", category: "Analysis", href: "/reports/analysis/options-analysis" },
              { icon: <Book />, label: "Margin status", category: "Funds", href: "/reports/funds/margin-status" },
              { icon: <UserCog />, label: "Document status", category: "Client admin", href: "/reports/client-admin/document-status" },
            ].map((report) => (
              <QuickActionCard
              key={report.label}
              icon={report.icon}
              label={report.label}
              category={report.category}
              href={report.href}
              className="sm:w-auto w-60 shrink-0"
            />
            ))}
          </div>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-medium mb-4">All reports</h2>
         <div className="relative w-full max-w-md mb-4">
           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
             <Search className="w-4 h-4" />
           </span>
           <input
             type="text"
             placeholder="Search by report name or category"
             className="pl-10 pr-4 py-2 w-full rounded-md border border bg-card-blend dark:bg-card-blend-dark text-foreground"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
         </div>
          <div className="bg-card-blend dark:bg-card-blend-dark rounded-lg overflow-hidden border ">
            <table className="w-full text-sm">
              <thead className="border-b text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Category</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredReports.map(([name, category]) => {
                  const href = `/reports/${category.toLowerCase().replace(/\s+/g, '-')}/${name.toLowerCase().replace(/\s+/g, '-')}`;
                  return (
                    <tr key={name} className="cursor-pointer hover:bg-white/10 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={href} onClick={() => window.scrollTo(0, 0)} className="block w-full h-full">{name}</Link>
                      </td>
                      <td className="px-4 py-3">{category}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">→</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}