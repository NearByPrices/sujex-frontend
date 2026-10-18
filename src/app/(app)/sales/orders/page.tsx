'use client'

import { useState } from 'react'
import { useSalesOrders } from '@/hooks/useSales'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Plus } from 'lucide-react'

const statusColor: Record<string, 'default' | 'info' | 'warning' | 'success' | 'danger'> = {
  Draft: 'default',
  Confirmed: 'info',
  Processing: 'warning',
  Shipped: 'info',
  Delivered: 'success',
  Cancelled: 'danger',
}

export default function SalesOrdersPage() {
  const [page] = useState(1)
  const { data, isLoading } = useSalesOrders(page)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Sales Orders</h1>
        <Button size="sm"><Plus size={14} className="mr-1" /> New Order</Button>
      </div>

      <div className="rounded-lg bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Order #</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Order Date</th>
              <th className="px-4 py-3 font-medium">Sub Total</th>
              <th className="px-4 py-3 font-medium">Tax</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Lines</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>}
            {data?.data?.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-blue-600">{o.orderNumber}</td>
                <td className="px-4 py-3"><Badge variant={statusColor[o.status] ?? 'default'}>{o.status}</Badge></td>
                <td className="px-4 py-3 text-gray-600">{formatDate(o.orderDate)}</td>
                <td className="px-4 py-3 text-gray-600">{formatCurrency(o.subTotal)}</td>
                <td className="px-4 py-3 text-gray-600">{formatCurrency(o.taxAmount)}</td>
                <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(o.totalAmount)}</td>
                <td className="px-4 py-3 text-gray-600">{o.lines?.length ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
