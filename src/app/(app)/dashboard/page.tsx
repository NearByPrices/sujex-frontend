import { Users, TrendingUp, ShoppingCart, Package } from 'lucide-react'

const stats = [
  { label: 'Total Contacts', value: '—', icon: Users, color: 'text-blue-600 bg-blue-50' },
  { label: 'Open Leads', value: '—', icon: TrendingUp, color: 'text-green-600 bg-green-50' },
  { label: 'Sales Orders', value: '—', icon: ShoppingCart, color: 'text-purple-600 bg-purple-50' },
  { label: 'Products', value: '—', icon: Package, color: 'text-orange-600 bg-orange-50' },
]

export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-lg bg-white p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
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
