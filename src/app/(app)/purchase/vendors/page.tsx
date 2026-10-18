'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useVendors, useCreateVendor, useDeleteVendor } from '@/hooks/usePurchase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Plus, Search, Trash2, X } from 'lucide-react'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().optional(),
  contactPerson: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  taxId: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  currency: z.string().default('USD'),
  paymentTermsDays: z.coerce.number().optional(),
  notes: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function VendorsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showDialog, setShowDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading } = useVendors(page, search || undefined)
  const createVendor = useCreateVendor()
  const deleteVendor = useDeleteVendor()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { currency: 'USD' },
  })

  const onSubmit = async (values: FormData) => {
    await createVendor.mutateAsync(values)
    reset()
    setShowDialog(false)
  }

  const vendors: any[] = data?.data ?? []
  const pagination = data?.pagination

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
        <Button size="sm" onClick={() => setShowDialog(true)}><Plus size={14} className="mr-1" /> New Vendor</Button>
      </div>

      <div className="mb-4 max-w-xs">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Search vendors…"
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
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Currency</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>}
            {!isLoading && vendors.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">No vendors found</td></tr>
            )}
            {vendors.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{v.name}</td>
                <td className="px-4 py-3 text-gray-600">{v.code ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{v.contactPerson ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{v.email ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{v.phone ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{v.currency}</td>
                <td className="px-4 py-3">
                  <Badge variant={v.isActive ? 'success' : 'default'}>{v.isActive ? 'Active' : 'Inactive'}</Badge>
                </td>
                <td className="px-4 py-3 text-gray-500">{formatDate(v.createdAt)}</td>
                <td className="px-4 py-3">
                  {deleteId === v.id ? (
                    <div className="flex gap-1">
                      <button onClick={() => { deleteVendor.mutate(v.id); setDeleteId(null) }} className="text-xs text-red-600 hover:underline">Confirm</button>
                      <button onClick={() => setDeleteId(null)} className="text-xs text-gray-400 hover:underline">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteId(v.id)} className="text-gray-400 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>{pagination.totalCount} total</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={vendors.length < pagination.pageSize} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">New Vendor</h2>
              <button onClick={() => { setShowDialog(false); reset() }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
                <input {...register('name')} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>
              {[
                ['code', 'Code'], ['contactPerson', 'Contact Person'], ['email', 'Email'],
                ['phone', 'Phone'], ['taxId', 'Tax ID'], ['currency', 'Currency'],
                ['paymentTermsDays', 'Payment Terms (days)'], ['city', 'City'], ['country', 'Country'],
              ].map(([field, label]) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                  <input {...register(field as any)} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                <input {...register('address')} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                <textarea {...register('notes')} rows={2} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="col-span-2 flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => { setShowDialog(false); reset() }}>Cancel</Button>
                <Button type="submit" size="sm" disabled={createVendor.isPending}>
                  {createVendor.isPending ? 'Saving…' : 'Create Vendor'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
