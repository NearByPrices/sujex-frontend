'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useProjects } from '@/hooks/useProjects'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Plus, Search } from 'lucide-react'

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  Planning: 'default',
  Active: 'success',
  OnHold: 'warning',
  Completed: 'success',
  Cancelled: 'danger',
}

export default function ProjectsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useProjects(page, search || undefined)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <Link href="/projects/new">
          <Button size="sm"><Plus size={14} className="mr-1" /> New Project</Button>
        </Link>
      </div>

      <div className="mb-4 max-w-xs">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Search projects…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Start Date</th>
              <th className="px-4 py-3 font-medium">End Date</th>
              <th className="px-4 py-3 font-medium text-right">Budget</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>}
            {!isLoading && data?.data?.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No projects yet</td></tr>
            )}
            {data?.data?.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link href={`/projects/${p.id}`} className="font-medium text-gray-900 hover:text-blue-600">{p.name}</Link>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.code ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{p.startDate ? formatDate(p.startDate) : '—'}</td>
                <td className="px-4 py-3 text-gray-600">{p.endDate ? formatDate(p.endDate) : '—'}</td>
                <td className="px-4 py-3 text-right text-gray-700">
                  {p.budget != null ? p.budget.toLocaleString() : '—'}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[p.status] ?? 'default'}>{p.status}</Badge>
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
