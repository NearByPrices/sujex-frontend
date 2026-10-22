'use client'

import { use } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Contact } from '@/types/api'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Mail, Phone, Building2 } from 'lucide-react'
import { RecordEditor, RecordField } from '@/components/ui/record-editor'
import { useQueryClient } from '@tanstack/react-query'

function useContact(id: string) {
  return useQuery<Contact>({
    queryKey: ['contacts', id],
    queryFn: () => api.get(`/api/v1/contacts/${id}`).then(r => r.data.data),
  })
}

export default function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: contact, isLoading } = useContact(id)
  const qc = useQueryClient()

  if (isLoading) return <div className="py-8 text-center text-gray-400">Loading…</div>
  if (!contact) return <div className="py-8 text-center text-gray-400">Contact not found</div>

  const fullName = [contact.firstName, contact.lastName].filter(Boolean).join(' ')

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/crm/contacts">
          <Button variant="outline" size="sm"><ArrowLeft size={14} className="mr-1" /> Back</Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{fullName || 'Contact'}</h1>
        <RecordEditor value={contact as unknown as Record<string, unknown>} fields={contactFields} onSave={async data => { await api.put(`/api/v1/contacts/${id}`, { ...data, isActive: data.isActive === true || data.isActive === 'true' }); await qc.invalidateQueries({ queryKey: ['contacts', id] }); await qc.invalidateQueries({ queryKey: ['contacts'] }) }} />
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100 space-y-4">
        {contact.email && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Mail size={15} className="text-gray-400" />
            <a href={`mailto:${contact.email}`} className="hover:text-blue-600">{contact.email}</a>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Phone size={15} className="text-gray-400" />
            {contact.phone}
          </div>
        )}
        {contact.companyId && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Building2 size={15} className="text-gray-400" />
            {contact.companyId}
          </div>
        )}

        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 pt-4 border-t border-gray-100 text-sm">
          {contact.jobTitle && (
            <div><dt className="text-gray-400">Job Title</dt><dd className="mt-0.5">{contact.jobTitle}</dd></div>
          )}
          {contact.notes && (
            <div className="col-span-2"><dt className="text-gray-400">Notes</dt><dd className="mt-0.5 text-gray-600">{contact.notes}</dd></div>
          )}
        </dl>
      </div>
    </div>
  )
}

const contactFields: RecordField[] = [
  { key: 'firstName', label: 'First name', required: true }, { key: 'lastName', label: 'Last name', required: true },
  { key: 'email', label: 'Email', type: 'email' }, { key: 'phone', label: 'Phone' }, { key: 'mobile', label: 'Mobile' },
  { key: 'jobTitle', label: 'Job title' }, { key: 'department', label: 'Department' }, { key: 'accountName', label: 'Account/company' },
  { key: 'tags', label: 'Tags' }, { key: 'notes', label: 'Notes', type: 'textarea' },
  { key: 'isActive', label: 'Active', type: 'select', options: ['true', 'false'] },
]
