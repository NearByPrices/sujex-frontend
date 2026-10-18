'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useEmployees } from '@/hooks/useHr'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Plus, Search } from 'lucide-react'

const statusColor: Record<string, string> = {
  Active: 'success',
  OnLeave: 'warning',
  Resigned: 'default',
  Terminated: 'danger',
}

export default function EmployeesPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading } = useEmployees(page, search || undefined)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
        <Link href="/hr/employees/new">
          <Button size="sm"><Plus size={14} className="mr-1" /> Add Employee</Button>
        </Link>
      </div>

      <div className="mb-4 max-w-xs">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Search employees…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Employee</th>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Hire Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>}
            {!isLoading && data?.data?.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No employees found</td></tr>
            )}
            {data?.data?.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link href={`/hr/employees/${e.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                    {e.fullName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{e.employeeCode}</td>
                <td className="px-4 py-3 text-gray-600">{e.email ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{e.departmentName ?? '—'}</td>
                <td className="px-4 py-3 text-gray-500">{formatDate(e.hireDate)}</td>
                <td className="px-4 py-3">
                  <Badge variant={(statusColor[e.status] ?? 'default') as 'success' | 'warning' | 'default' | 'danger'}>
                    {e.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data?.pagination && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>{data.pagination.total} total</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= data.pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  )
}
