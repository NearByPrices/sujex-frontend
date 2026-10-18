'use client'

import { useState } from 'react'
import { useLeaveRequests } from '@/hooks/useHr'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  Pending: 'warning',
  Approved: 'success',
  Rejected: 'danger',
  Cancelled: 'default',
}

export default function LeaveRequestsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useLeaveRequests(page)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
      </div>

      <div className="rounded-lg bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Employee</th>
              <th className="px-4 py-3 font-medium">Leave Type</th>
              <th className="px-4 py-3 font-medium">From</th>
              <th className="px-4 py-3 font-medium">To</th>
              <th className="px-4 py-3 font-medium">Days</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>}
            {!isLoading && data?.data?.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No leave requests</td></tr>
            )}
            {data?.data?.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{r.employeeName ?? r.employeeId}</td>
                <td className="px-4 py-3 text-gray-600">{r.leaveTypeName ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(r.startDate)}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(r.endDate)}</td>
                <td className="px-4 py-3 text-gray-600">{r.totalDays}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[r.status] ?? 'default'}>{r.status}</Badge>
                </td>
                <td className="px-4 py-3 text-gray-500">{formatDate(r.createdAt)}</td>
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
