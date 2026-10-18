'use client'

import { useAccounts } from '@/hooks/useFinance'
import { Badge } from '@/components/ui/badge'

const typeColor: Record<string, string> = {
  Asset: 'bg-blue-50 text-blue-700',
  Liability: 'bg-red-50 text-red-700',
  Equity: 'bg-purple-50 text-purple-700',
  Income: 'bg-green-50 text-green-700',
  Expense: 'bg-orange-50 text-orange-700',
}

export default function AccountsPage() {
  const { data: accounts, isLoading } = useAccounts()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Chart of Accounts</h1>
      </div>

      <div className="rounded-lg bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Account Name</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium text-right">Balance</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>}
            {!isLoading && accounts?.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No accounts yet</td></tr>
            )}
            {accounts?.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{a.accountCode}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{a.accountName}</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-0.5 text-xs font-medium ${typeColor[a.accountType] ?? 'bg-gray-100 text-gray-600'}`}>
                    {a.accountType}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-700">
                  {a.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={a.isActive ? 'success' : 'default'}>{a.isActive ? 'Active' : 'Inactive'}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
