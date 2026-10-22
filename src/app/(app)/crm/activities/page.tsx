'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Activity, ApiResponse, PagedResult } from '@/types/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Search } from 'lucide-react'

function useActivities(page = 1) {
  return useQuery<{ data: Activity[]; pagination?: PagedResult<Activity>['pagination'] }>({
    queryKey: ['activities', page],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PagedResult<Activity>>>('/api/v1/activities', { params: { page, pageSize: 20 } })
      return { data: Array.isArray(response.data.data) ? response.data.data : response.data.data?.items ?? [], pagination: response.data.pagination ?? response.data.data?.pagination }
    },
  })
}

const typeVariant: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  Call: 'default',
  Email: 'warning',
  Meeting: 'success',
  Task: 'default',
  Note: 'default',
}

export default function ActivitiesPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useActivities(page)

  const filtered = search
    ? data?.data?.filter(a => a.subject?.toLowerCase().includes(search.toLowerCase()))
    : data?.data

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
      </div>

      <div className="mb-4 max-w-xs">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Search activities…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Due Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>}
            {!isLoading && filtered?.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No activities yet</td></tr>
            )}
            {filtered?.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Badge variant={typeVariant[a.type] ?? 'default'}>{a.type}</Badge>
                </td>
                <td className="px-4 py-3 text-gray-900 font-medium">{a.subject}</td>
                <td className="px-4 py-3 text-gray-600">{a.dueDate ? formatDate(a.dueDate) : '—'}</td>
                <td className="px-4 py-3 text-gray-600">{a.isCompleted ? 'Completed' : 'Open'}</td>
                <td className="px-4 py-3 text-gray-500 truncate max-w-xs">{a.description ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data?.pagination && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>{data.pagination.totalCount ?? data.pagination.total} total</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= data.pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  )
}
