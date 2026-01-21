'use client'

import clsx from 'clsx'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { useState } from 'react'

interface Application {
  createdDate: string
  type: string
  associatedClient: string
  status: 'Draft' | 'In Progress' | 'Approved' | 'Denied'
}

const MOCK_APPLICATIONS: Application[] = [
  {
    createdDate: 'Feb 18, 2025',
    type: 'Client and account',
    associatedClient: 'Randy Chance Bator',
    status: 'Draft'
  }
]

export default function AccountOpeningPage() {
  const [activeTab, setActiveTab] = useState<'in-progress' | 'approved' | 'denied'>('in-progress')
  
  return (
    <div className="min-h-screen ">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2>Client and account opening</h2>
          <p className={clsx("text-sm text-gray-500", "dark:text-gray-400")}>Last update 02/18/2025 8:05 AM ET</p>
        </div>
        <Button>Create new</Button>
      </div>

      <div className="bg-card-blend dark:bg-card-blend-dark rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">All applications</h2>
          
          <div className="flex gap-2 mb-6">
            <Button 
              variant={activeTab === 'in-progress' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('in-progress')}
              className="rounded-full"
            >
              In progress
            </Button>
            <Button 
              variant={activeTab === 'approved' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('approved')}
              className="rounded-full"
            >
              Approved
            </Button>
            <Button 
              variant={activeTab === 'denied' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('denied')}
              className="rounded-full"
            >
              Denied
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Created date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Associated client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_APPLICATIONS.map((application, index) => (
                <TableRow key={index}>
                  <TableCell>{application.createdDate}</TableCell>
                  <TableCell>{application.type}</TableCell>
                  <TableCell>{application.associatedClient}</TableCell>
                  <TableCell>
                    <span className={clsx("px-3 py-1 bg-blue-50 text-blue-700", "dark:bg-blue-900 dark:text-blue-300", "rounded-full text-sm")}>
                      {application.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Resume</Button>
                      <Button variant="outline" size="sm">Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}