'use client'

import { useState } from 'react'
import { useJournalEntries } from '@/hooks/useFinance'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  Pending: 'warning',
  Approved: 'success',
  Rejected: 'danger',
  Cancelled: 'default',
}

export default function JournalEntriesPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useJournalEntries(page)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Journal Entries</h1>
      </div>

      <div className="rounded-lg bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Entry #</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Reference</th>
              <th className="px-4 py-3 font-medium">Currency</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>}
            {!isLoading && data?.data?.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No journal entries</td></tr>
            )}
            {data?.data?.map((j) => (
              <tr key={j.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{j.entryNumber}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(j.entryDate)}</td>
                <td className="px-4 py-3 text-gray-900">{j.description}</td>
                <td className="px-4 py-3 text-gray-500">{j.referenceNumber ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{j.currency}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[j.status] ?? 'default'}>{j.status}</Badge>
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
