'use client'

import { useState } from 'react'
import { useLeads, useConvertLead } from '@/hooks/useCrm'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Plus, Search, ArrowRightCircle } from 'lucide-react'
import Link from 'next/link'

const statusVariant: Record<string, 'default' | 'info' | 'warning' | 'success' | 'danger'> = {
  New: 'info',
  Contacted: 'warning',
  Qualified: 'success',
  Lost: 'danger',
  Converted: 'default',
}

export default function LeadsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading } = useLeads(page, search || undefined)
  const convertLead = useConvertLead()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <Button size="sm"><Plus size={14} className="mr-1" /> Add Lead</Button>
      </div>

      <div className="mb-4 max-w-xs">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Search leads…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Est. Value</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>
            )}
            {data?.data?.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-blue-700"><Link href={`/crm/leads/${l.id}`} className="hover:underline">{l.title}</Link></td>
                <td className="px-4 py-3 text-gray-600">{[l.firstName, l.lastName].filter(Boolean).join(' ') || '—'}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[l.status] ?? 'default'}>{l.status}</Badge>
                </td>
                <td className="px-4 py-3 text-gray-600">{l.estimatedValue != null ? formatCurrency(l.estimatedValue) : '—'}</td>
                <td className="px-4 py-3 text-gray-600">{l.source ?? '—'}</td>
                <td className="px-4 py-3 text-gray-500">{formatDate(l.createdAt)}</td>
                <td className="px-4 py-3">
                  {!l.convertedOpportunityId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => convertLead.mutate({ id: l.id, data: { opportunityTitle: l.title, expectedValue: l.estimatedValue } })}
                    >
                      <ArrowRightCircle size={14} className="mr-1" /> Convert
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
