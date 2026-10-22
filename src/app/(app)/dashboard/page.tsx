'use client'

import { useQuery } from '@tanstack/react-query'
import { Users, TrendingUp, ShoppingCart, Package, BriefcaseBusiness, UserRound, FolderKanban, CalendarClock } from 'lucide-react'
import api from '@/lib/api'
import type { ApiResponse, DashboardMetrics } from '@/types/api'
import { Button } from '@/components/ui/button'

const stats = [
  { key: 'totalContacts', label: 'Total Contacts', icon: Users, color: 'text-blue-600 bg-blue-50' },
  { key: 'openLeads', label: 'Open Leads', icon: TrendingUp, color: 'text-green-600 bg-green-50' },
  { key: 'salesOrdersThisMonth', label: 'Orders This Month', icon: ShoppingCart, color: 'text-purple-600 bg-purple-50' },
  { key: 'totalProducts', label: 'Active Products', icon: Package, color: 'text-orange-600 bg-orange-50' },
  { key: 'activeOpportunities', label: 'Open Opportunities', icon: BriefcaseBusiness, color: 'text-cyan-600 bg-cyan-50' },
  { key: 'activeEmployees', label: 'Active Employees', icon: UserRound, color: 'text-indigo-600 bg-indigo-50' },
  { key: 'activeProjects', label: 'Active Projects', icon: FolderKanban, color: 'text-rose-600 bg-rose-50' },
  { key: 'pendingLeaveRequests', label: 'Pending Leave', icon: CalendarClock, color: 'text-amber-600 bg-amber-50' },
] as const

export default function DashboardPage() {
  const dashboard = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => (await api.get<ApiResponse<DashboardMetrics>>('/api/v1/reports/dashboard')).data.data,
  })

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-900">Dashboard</h1><p className="mt-1 text-sm text-gray-500">Your business at a glance</p></div>
        <Button variant="outline" size="sm" onClick={() => dashboard.refetch()} disabled={dashboard.isFetching}>{dashboard.isFetching ? 'Refreshing…' : 'Refresh'}</Button>
      </div>
      {dashboard.isError && <p className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">Dashboard data could not be loaded. Check the API connection and try again.</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ key, label, icon: Icon, color }) => (
          <div key={label} className="rounded-lg bg-white p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.isLoading ? '…' : dashboard.data?.[key] ?? '—'}</p>
              </div>
              <div className={`rounded-lg p-3 ${color}`}>
                <Icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
