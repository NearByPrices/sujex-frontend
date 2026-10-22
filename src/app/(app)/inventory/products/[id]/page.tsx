'use client'

import { use } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Product } from '@/types/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import { RecordEditor, RecordField } from '@/components/ui/record-editor'
import { useQueryClient } from '@tanstack/react-query'

function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: ['products', id],
    queryFn: () => api.get(`/api/v1/inventory/products/${id}`).then(r => r.data.data),
  })
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: product, isLoading } = useProduct(id)
  const qc = useQueryClient()

  if (isLoading) return <div className="py-8 text-center text-gray-400">Loading…</div>
  if (!product) return <div className="py-8 text-center text-gray-400">Product not found</div>

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/inventory/products">
          <Button variant="outline" size="sm"><ArrowLeft size={14} className="mr-1" /> Back</Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
        {product.isActive !== undefined && (
          <Badge variant={product.isActive ? 'success' : 'danger'}>{product.isActive ? 'Active' : 'Inactive'}</Badge>
        )}
        <RecordEditor value={product as unknown as Record<string, unknown>} fields={productFields} onSave={async data => { await api.put(`/api/v1/products/${id}`, { ...data, isActive: data.isActive === true || data.isActive === 'true', isService: data.isService === true || data.isService === 'true' }); await qc.invalidateQueries({ queryKey: ['products', id] }); await qc.invalidateQueries({ queryKey: ['products'] }) }} />
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
          {product.code && (
            <div><dt className="text-gray-400">Code</dt><dd className="font-mono mt-0.5">{product.code}</dd></div>
          )}
          {product.sku && (
            <div><dt className="text-gray-400">SKU</dt><dd className="font-mono mt-0.5">{product.sku}</dd></div>
          )}
          {product.salePrice != null && (
            <div>
              <dt className="text-gray-400">Sales Price</dt>
              <dd className="font-mono mt-0.5">{product.salePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</dd>
            </div>
          )}
          {product.costPrice != null && (
            <div>
              <dt className="text-gray-400">Purchase Price</dt>
              <dd className="font-mono mt-0.5">{product.costPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</dd>
            </div>
          )}
          {product.reorderPoint != null && (
            <div>
              <dt className="text-gray-400">Reorder Level</dt>
              <dd className="font-mono mt-0.5">{product.reorderPoint}</dd>
            </div>
          )}
          {product.totalStock != null && (
            <div>
              <dt className="text-gray-400">Current Stock</dt>
              <dd className="font-mono mt-0.5 font-semibold text-gray-900">{product.totalStock}</dd>
            </div>
          )}
        </dl>
        {product.description && (
          <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">{product.description}</div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <Link href="/inventory/stock-movements">
          <Button variant="outline" size="sm">View Stock Movements</Button>
        </Link>
      </div>
    </div>
  )
}

const productFields: RecordField[] = [
  { key: 'name', label: 'Name', required: true }, { key: 'code', label: 'Code' }, { key: 'sku', label: 'SKU' }, { key: 'barcode', label: 'Barcode' },
  { key: 'costPrice', label: 'Cost price', required: true, type: 'number' }, { key: 'salePrice', label: 'Sale price', required: true, type: 'number' },
  { key: 'categoryId', label: 'Category ID' }, { key: 'unitId', label: 'Unit ID' }, { key: 'minStockLevel', label: 'Minimum stock', type: 'number' },
  { key: 'maxStockLevel', label: 'Maximum stock', type: 'number' }, { key: 'reorderPoint', label: 'Reorder point', type: 'number' },
  { key: 'isActive', label: 'Active', type: 'select', options: ['true', 'false'] }, { key: 'isService', label: 'Service item', type: 'select', options: ['true', 'false'] },
  { key: 'tags', label: 'Tags' }, { key: 'description', label: 'Description', type: 'textarea' },
]
