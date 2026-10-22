'use client'

import { use } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Opportunity } from '@/types/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { RecordEditor, RecordField } from '@/components/ui/record-editor'
import { useQueryClient } from '@tanstack/react-query'

function useOpportunity(id: string) {
  return useQuery<Opportunity>({
    queryKey: ['opportunities', id],
    queryFn: () => api.get(`/api/v1/crm/opportunities/${id}`).then(r => r.data.data),
  })
}

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  Prospecting: 'default',
  Qualification: 'warning',
  Proposal: 'warning',
  Negotiation: 'warning',
  ClosedWon: 'success',
  ClosedLost: 'danger',
}

export default function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: opp, isLoading } = useOpportunity(id)
  const qc = useQueryClient()

  if (isLoading) return <div className="py-8 text-center text-gray-400">Loading…</div>
  if (!opp) return <div className="py-8 text-center text-gray-400">Opportunity not found</div>

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/crm/opportunities">
          <Button variant="outline" size="sm"><ArrowLeft size={14} className="mr-1" /> Back</Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{opp.title}</h1>
        <Badge variant={statusVariant[opp.status] ?? 'default'}>{opp.status}</Badge>
        <RecordEditor value={opp as unknown as Record<string, unknown>} fields={opportunityFields} onSave={async data => { await api.put(`/api/v1/opportunities/${id}`, data); await qc.invalidateQueries({ queryKey: ['opportunities', id] }); await qc.invalidateQueries({ queryKey: ['opportunities'] }) }} />
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
          {opp.expectedValue != null && (
            <div>
              <dt className="text-gray-400">Value</dt>
              <dd className="font-mono mt-0.5 text-lg font-semibold text-gray-900">{opp.expectedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</dd>
            </div>
          )}
          {opp.probability != null && (
            <div><dt className="text-gray-400">Probability</dt><dd className="mt-0.5">{opp.probability}%</dd></div>
          )}
          {opp.expectedCloseDate && (
            <div><dt className="text-gray-400">Expected Close</dt><dd className="mt-0.5">{formatDate(opp.expectedCloseDate)}</dd></div>
          )}
          {opp.stage && (
            <div><dt className="text-gray-400">Stage</dt><dd className="mt-0.5">{opp.stage}</dd></div>
          )}
          {opp.notes && (
            <div className="col-span-2"><dt className="text-gray-400">Notes</dt><dd className="mt-0.5 text-gray-600">{opp.notes}</dd></div>
          )}
        </dl>

        {opp.expectedValue != null && opp.probability != null && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-400">Weighted Value</p>
            <p className="text-xl font-bold text-blue-700">{(opp.expectedValue * opp.probability / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        )}
      </div>
    </div>
  )
}

const opportunityFields: RecordField[] = [
  { key: 'title', label: 'Title', required: true },
  { key: 'status', label: 'Status', required: true, type: 'select', options: ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'ClosedWon', 'ClosedLost'] },
  { key: 'expectedValue', label: 'Expected value', type: 'number' }, { key: 'actualValue', label: 'Actual value', type: 'number' },
  { key: 'probability', label: 'Probability (%)', type: 'number' }, { key: 'expectedCloseDate', label: 'Expected close', type: 'date' },
  { key: 'actualCloseDate', label: 'Actual close', type: 'date' }, { key: 'stage', label: 'Stage' }, { key: 'notes', label: 'Notes', type: 'textarea' }, { key: 'lostReason', label: 'Lost reason', type: 'textarea' },
]
