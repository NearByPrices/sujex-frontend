'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const schema = z.object({
  name: z.string().min(1, 'Product name required'),
  code: z.string().optional(),
  sku: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  unitId: z.string().optional(),
  salesPrice: z.string().optional(),
  purchasePrice: z.string().optional(),
  reorderLevel: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function NewProductPage() {
  const router = useRouter()
  const qc = useQueryClient()
  const create = useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post('/api/v1/inventory/products', data).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); router.push('/inventory/products') },
  })

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    await create.mutateAsync({
      ...data,
      salesPrice: data.salesPrice ? parseFloat(data.salesPrice) : undefined,
      purchasePrice: data.purchasePrice ? parseFloat(data.purchasePrice) : undefined,
      reorderLevel: data.reorderLevel ? parseFloat(data.reorderLevel) : undefined,
    })
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/inventory/products">
          <Link href="/inventory/products"><Button variant="outline" size="sm"><ArrowLeft size={14} className="mr-1" /> Back</Button></Link>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">New Product</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg bg-white p-6 shadow-sm border border-gray-100 space-y-4">
        <Input label="Product Name" error={errors.name?.message} {...register('name')} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Code" {...register('code')} />
          <Input label="SKU" {...register('sku')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            rows={3}
            {...register('description')}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Category ID" {...register('categoryId')} />
          <Input label="Unit ID" {...register('unitId')} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Input label="Sales Price" type="number" step="0.0001" {...register('salesPrice')} />
          <Input label="Purchase Price" type="number" step="0.0001" {...register('purchasePrice')} />
          <Input label="Reorder Level" type="number" step="0.0001" {...register('reorderLevel')} />
        </div>

        {create.error && (
          <p className="text-sm text-red-600">Failed to create product. Please try again.</p>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" isLoading={isSubmitting}>Create Product</Button>
          <Link href="/inventory/products"><Button type="button" variant="outline">Cancel</Button></Link>
        </div>
      </form>
    </div>
  )
}
