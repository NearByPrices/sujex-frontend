'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { usePurchaseOrders, useCreatePurchaseOrder, useUpdatePurchaseOrderStatus } from '@/hooks/usePurchase'
import { useVendors } from '@/hooks/usePurchase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Plus, X } from 'lucide-react'

const schema = z.object({
  vendorId: z.string().min(1, 'Vendor is required'),
  orderDate: z.string().optional(),
  expectedDeliveryDate: z.string().optional(),
  currency: z.string().default('USD'),
  notes: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const statusColor: Record<string, 'default' | 'info' | 'warning' | 'success' | 'danger'> = {
  Draft: 'default',
  Sent: 'info',
  Confirmed: 'warning',
  Received: 'success',
  Cancelled: 'danger',
}

const STATUSES = ['Draft', 'Sent', 'Confirmed', 'Received', 'Cancelled']

export default function PurchaseOrdersPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [showDialog, setShowDialog] = useState(false)

  const { data, isLoading } = usePurchaseOrders(page, statusFilter || undefined)
  const { data: vendorsData } = useVendors(1)
  const createOrder = useCreatePurchaseOrder()
  const updateStatus = useUpdatePurchaseOrderStatus()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { currency: 'USD' },
  })

  const onSubmit = async (values: FormData) => {
    await createOrder.mutateAsync(values)
    reset()
    setShowDialog(false)
  }

  const orders: any[] = data?.data ?? []
  const pagination = data?.pagination
  const vendors: any[] = vendorsData?.data ?? []

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
        <Button size="sm" onClick={() => setShowDialog(true)}><Plus size={14} className="mr-1" /> New Order</Button>
      </div>

      <div className="mb-4 flex gap-2">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="rounded-lg bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Order #</th>
              <th className="px-4 py-3 font-medium">Vendor</th>
              <th className="px-4 py-3 font-medium">Order Date</th>
              <th className="px-4 py-3 font-medium">Expected Delivery</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>}
            {!isLoading && orders.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No purchase orders found</td></tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-blue-600">{o.orderNumber}</td>
                <td className="px-4 py-3 text-gray-900">{o.vendorName}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(o.orderDate)}</td>
                <td className="px-4 py-3 text-gray-600">{o.expectedDeliveryDate ? formatDate(o.expectedDeliveryDate) : '—'}</td>
                <td className="px-4 py-3"><Badge variant={statusColor[o.status] ?? 'default'}>{o.status}</Badge></td>
                <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(o.total)}</td>
                <td className="px-4 py-3">
                  <select
                    defaultValue={o.status}
                    onChange={(e) => updateStatus.mutate({ id: o.id, status: e.target.value })}
                    className="rounded border border-gray-200 px-2 py-1 text-xs focus:outline-none"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
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
            <Button variant="outline" size="sm" disabled={orders.length < pagination.pageSize} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">New Purchase Order</h2>
              <button onClick={() => { setShowDialog(false); reset() }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Vendor *</label>
                <select {...register('vendorId')} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                  <option value="">Select vendor…</option>
                  {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
                {errors.vendorId && <p className="mt-1 text-xs text-red-500">{errors.vendorId.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Order Date</label>
                  <input type="date" {...register('orderDate')} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Expected Delivery</label>
                  <input type="date" {...register('expectedDeliveryDate')} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Currency</label>
                <input {...register('currency')} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                <textarea {...register('notes')} rows={2} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => { setShowDialog(false); reset() }}>Cancel</Button>
                <Button type="submit" size="sm" disabled={createOrder.isPending}>
                  {createOrder.isPending ? 'Saving…' : 'Create Order'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
