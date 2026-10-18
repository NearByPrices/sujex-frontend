'use client'

import { useState } from 'react'
import { useSalesInvoices } from '@/hooks/useFinance'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Search } from 'lucide-react'

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  Draft: 'default',
  Sent: 'warning',
  PartiallyPaid: 'warning',
  Paid: 'success',
  Overdue: 'danger',
  Cancelled: 'default',
}

export default function InvoicesPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useSalesInvoices(page, search || undefined)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Sales Invoices</h1>
      </div>

      <div className="mb-4 max-w-xs">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Search invoices…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Invoice #</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Due Date</th>
              <th className="px-4 py-3 font-medium text-right">Total</th>
              <th className="px-4 py-3 font-medium text-right">Balance</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>}
            {!isLoading && data?.data?.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No invoices</td></tr>
            )}
            {data?.data?.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{inv.invoiceNumber}</td>
                <td className="px-4 py-3 text-gray-900">{inv.customerName ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(inv.invoiceDate)}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(inv.dueDate)}</td>
                <td className="px-4 py-3 text-right font-mono text-gray-700">
                  {inv.total.toLocaleString('en-US', { minimumFractionDigits: 2 })} {inv.currency}
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-700">
                  {inv.balanceDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[inv.status] ?? 'default'}>{inv.status}</Badge>
                </td>
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
