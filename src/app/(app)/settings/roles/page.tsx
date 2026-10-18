'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

interface AppRole { id: string; name: string; description?: string; permissionCount?: number }

export default function RolesPage() {
  const { data, isLoading } = useQuery<{ data: AppRole[] }>({
    queryKey: ['roles'],
    queryFn: () => api.get('/api/v1/identity/roles').then(r => r.data),
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Roles</h1>
      </div>

      <div className="rounded-lg bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Role Name</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium text-right">Permissions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>}
            {!isLoading && data?.data?.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">No roles defined</td></tr>
            )}
            {data?.data?.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                <td className="px-4 py-3 text-gray-600">{r.description ?? '—'}</td>
                <td className="px-4 py-3 text-right text-gray-500">{r.permissionCount ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
