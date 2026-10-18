'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useStockMovements, useCreateStockMovement } from '@/hooks/useInventoryExtra'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils'
import { Plus, X } from 'lucide-react'

const schema = z.object({
  productId: z.string().min(1, 'Product required'),
  warehouseId: z.string().min(1, 'Warehouse required'),
  movementType: z.enum(['In', 'Out', 'Transfer', 'Adjustment']),
  quantity: z.string().min(1, 'Quantity required'),
  unitCost: z.string().optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const typeVariant: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  In: 'success',
  Out: 'danger',
  Transfer: 'warning',
  Adjustment: 'default',
}

export default function StockMovementsPage() {
  const [showForm, setShowForm] = useState(false)
  const [page, setPage] = useState(1)
  const { data, isLoading } = useStockMovements(page)
  const createMovement = useCreateStockMovement()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { movementType: 'In' },
  })

  const onSubmit = async (data: FormData) => {
    await createMovement.mutateAsync({
      ...data,
      quantity: parseFloat(data.quantity),
      unitCost: data.unitCost ? parseFloat(data.unitCost) : undefined,
    })
    reset()
    setShowForm(false)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Stock Movements</h1>
        <Button size="sm" onClick={() => setShowForm(v => !v)}>
          {showForm ? <><X size={14} className="mr-1" /> Cancel</> : <><Plus size={14} className="mr-1" /> Record Movement</>}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-6 rounded-lg bg-white p-5 shadow-sm border border-gray-100">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Input label="Product ID" error={errors.productId?.message} {...register('productId')} />
            <Input label="Warehouse ID" error={errors.warehouseId?.message} {...register('warehouseId')} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                {...register('movementType')}
              >
                <option value="In">In</option>
                <option value="Out">Out</option>
                <option value="Transfer">Transfer</option>
                <option value="Adjustment">Adjustment</option>
              </select>
            </div>
            <Input label="Quantity" type="number" step="0.0001" error={errors.quantity?.message} {...register('quantity')} />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <Input label="Unit Cost" type="number" step="0.0001" {...register('unitCost')} />
            <Input label="Reference" {...register('reference')} />
            <Input label="Notes" {...register('notes')} />
          </div>
          <div className="mt-3">
            <Button type="submit" size="sm" isLoading={isSubmitting}>Save Movement</Button>
          </div>
        </form>
      )}

      <div className="rounded-lg bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Warehouse</th>
              <th className="px-4 py-3 font-medium text-right">Qty</th>
              <th className="px-4 py-3 font-medium text-right">Unit Cost</th>
              <th className="px-4 py-3 font-medium">Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>}
            {!isLoading && data?.data?.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No movements yet</td></tr>
            )}
            {data?.data?.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-600">{formatDate(m.createdAt)}</td>
                <td className="px-4 py-3"><Badge variant={typeVariant[m.movementType] ?? 'default'}>{m.movementType}</Badge></td>
                <td className="px-4 py-3 text-gray-900">{m.productName ?? m.productId}</td>
                <td className="px-4 py-3 text-gray-600">{m.warehouseName ?? m.warehouseId}</td>
                <td className="px-4 py-3 text-right font-mono text-gray-700">{m.quantity}</td>
                <td className="px-4 py-3 text-right font-mono text-gray-500">{m.unitCost != null ? m.unitCost.toLocaleString('en-US', { minimumFractionDigits: 4 }) : '—'}</td>
                <td className="px-4 py-3 text-gray-500">{m.reference ?? '—'}</td>
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
