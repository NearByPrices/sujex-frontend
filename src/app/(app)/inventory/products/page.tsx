'use client'

import { useState } from 'react'
import { useProducts } from '@/hooks/useInventory'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { Plus, Search } from 'lucide-react'
import Link from 'next/link'

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading } = useProducts(page, search || undefined)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link href="/inventory/products/new"><Button size="sm"><Plus size={14} className="mr-1" /> Add Product</Button></Link>
      </div>

      <div className="mb-4 max-w-xs">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Search products…"
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
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Unit</th>
              <th className="px-4 py-3 font-medium">Cost</th>
              <th className="px-4 py-3 font-medium">Sale Price</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>
            )}
            {data?.data?.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-blue-700"><Link href={`/inventory/products/${p.id}`} className="hover:underline">{p.name}</Link></td>
                <td className="px-4 py-3 text-gray-600">{p.sku ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{p.categoryName ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{p.unitSymbol ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{formatCurrency(p.costPrice)}</td>
                <td className="px-4 py-3 text-gray-900 font-medium">{formatCurrency(p.salePrice)}</td>
                <td className="px-4 py-3"><Badge variant="info">{p.isService ? 'Service' : 'Product'}</Badge></td>
                <td className="px-4 py-3"><Badge variant={p.isActive ? 'success' : 'default'}>{p.isActive ? 'Active' : 'Inactive'}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
