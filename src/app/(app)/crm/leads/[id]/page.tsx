'use client'

import { use } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Lead } from '@/types/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, RefreshCw } from 'lucide-react'

function useLead(id: string) {
  return useQuery<Lead>({
    queryKey: ['leads', id],
    queryFn: () => api.get(`/api/v1/crm/leads/${id}`).then(r => r.data.data),
  })
}

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  New: 'default',
  Contacted: 'warning',
  Qualified: 'success',
  Unqualified: 'danger',
  Converted: 'success',
}

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: lead, isLoading } = useLead(id)
  const qc = useQueryClient()
  const convertLead = useMutation({
    mutationFn: () => api.patch(`/api/v1/crm/leads/${id}/convert`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads', id] }),
  })

  if (isLoading) return <div className="py-8 text-center text-gray-400">Loading…</div>
  if (!lead) return <div className="py-8 text-center text-gray-400">Lead not found</div>

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/crm/leads">
          <Button variant="outline" size="sm"><ArrowLeft size={14} className="mr-1" /> Back</Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{lead.title}</h1>
        <Badge variant={statusVariant[lead.status] ?? 'default'}>{lead.status}</Badge>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
          {lead.firstName && (
            <div><dt className="text-gray-400">Name</dt><dd className="mt-0.5">{[lead.firstName, lead.lastName].filter(Boolean).join(' ')}</dd></div>
          )}
          {lead.company && (
            <div><dt className="text-gray-400">Company</dt><dd className="mt-0.5">{lead.company}</dd></div>
          )}
          {lead.email && (
            <div><dt className="text-gray-400">Email</dt><dd className="mt-0.5"><a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">{lead.email}</a></dd></div>
          )}
          {lead.phone && (
            <div><dt className="text-gray-400">Phone</dt><dd className="mt-0.5">{lead.phone}</dd></div>
          )}
          {lead.estimatedValue != null && (
            <div><dt className="text-gray-400">Estimated Value</dt><dd className="font-mono mt-0.5">{lead.estimatedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</dd></div>
          )}
          {lead.source && (
            <div><dt className="text-gray-400">Source</dt><dd className="mt-0.5">{lead.source}</dd></div>
          )}
          {lead.notes && (
            <div className="col-span-2"><dt className="text-gray-400">Notes</dt><dd className="mt-0.5 text-gray-600">{lead.notes}</dd></div>
          )}
        </dl>
      </div>

      {lead.status !== 'Converted' && (
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => convertLead.mutate()}
            isLoading={convertLead.isPending}
          >
            <RefreshCw size={14} className="mr-1" /> Convert to Opportunity
          </Button>
        </div>
      )}
    </div>
  )
}
