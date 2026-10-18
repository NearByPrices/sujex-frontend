'use client'

import { use } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Contact } from '@/types/api'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Mail, Phone, Building2 } from 'lucide-react'

function useContact(id: string) {
  return useQuery<Contact>({
    queryKey: ['contacts', id],
    queryFn: () => api.get(`/api/v1/crm/contacts/${id}`).then(r => r.data.data),
  })
}

export default function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: contact, isLoading } = useContact(id)

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
        {contact.company && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Building2 size={15} className="text-gray-400" />
            {contact.company}
          </div>
        )}

        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 pt-4 border-t border-gray-100 text-sm">
          {contact.jobTitle && (
            <div><dt className="text-gray-400">Job Title</dt><dd className="mt-0.5">{contact.jobTitle}</dd></div>
          )}
          {contact.website && (
            <div><dt className="text-gray-400">Website</dt><dd className="mt-0.5"><a href={contact.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{contact.website}</a></dd></div>
          )}
          {contact.address && (
            <div className="col-span-2"><dt className="text-gray-400">Address</dt><dd className="mt-0.5">{contact.address}</dd></div>
          )}
          {contact.notes && (
            <div className="col-span-2"><dt className="text-gray-400">Notes</dt><dd className="mt-0.5 text-gray-600">{contact.notes}</dd></div>
          )}
        </dl>
      </div>
    </div>
  )
}
