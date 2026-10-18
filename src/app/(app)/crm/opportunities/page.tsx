'use client'

import { useState } from 'react'
import { useOpportunities } from '@/hooks/useCrm'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Plus } from 'lucide-react'

const statusColor: Record<string, 'default' | 'info' | 'warning' | 'success' | 'danger'> = {
  Open: 'info',
  Won: 'success',
  Lost: 'danger',
  OnHold: 'warning',
}

export default function OpportunitiesPage() {
  const [page] = useState(1)
  const { data, isLoading } = useOpportunities(page)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Opportunities</h1>
        <Button size="sm"><Plus size={14} className="mr-1" /> Add Opportunity</Button>
      </div>

      <div className="rounded-lg bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Stage</th>
              <th className="px-4 py-3 font-medium">Expected Value</th>
              <th className="px-4 py-3 font-medium">Probability</th>
              <th className="px-4 py-3 font-medium">Close Date</th>
              <th className="px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>
            )}
            {data?.data?.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{o.title}</td>
                <td className="px-4 py-3"><Badge variant={statusColor[o.status] ?? 'default'}>{o.status}</Badge></td>
                <td className="px-4 py-3 text-gray-600">{o.stage ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{o.expectedValue != null ? formatCurrency(o.expectedValue) : '—'}</td>
                <td className="px-4 py-3 text-gray-600">{o.probability}%</td>
                <td className="px-4 py-3 text-gray-500">{o.expectedCloseDate ? formatDate(o.expectedCloseDate) : '—'}</td>
                <td className="px-4 py-3 text-gray-500">{formatDate(o.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
