'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, TrendingUp, Target, Package, Warehouse, ShoppingCart,
  FileText, UserCircle, DollarSign, FolderOpen, Settings, LogOut, Truck, ClipboardList,
  Activity, Boxes, Building2, CalendarDays, BookOpen, Network
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const groups = [
  { label: 'Overview', items: [{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }] },
  { label: 'CRM', items: [{ label: 'Contacts', href: '/crm/contacts', icon: Users }, { label: 'Leads', href: '/crm/leads', icon: TrendingUp }, { label: 'Opportunities', href: '/crm/opportunities', icon: Target }, { label: 'Activities', href: '/crm/activities', icon: Activity }] },
  { label: 'Inventory', items: [{ label: 'Products', href: '/inventory/products', icon: Package }, { label: 'Categories', href: '/inventory/categories', icon: Boxes }, { label: 'Warehouses', href: '/inventory/warehouses', icon: Warehouse }, { label: 'Stock Movements', href: '/inventory/stock-movements', icon: Network }] },
  { label: 'Sales & Purchase', items: [{ label: 'Sales Orders', href: '/sales/orders', icon: ShoppingCart }, { label: 'Invoices', href: '/sales/invoices', icon: FileText }, { label: 'Vendors', href: '/purchase/vendors', icon: Truck }, { label: 'Purchase Orders', href: '/purchase/orders', icon: ClipboardList }] },
  { label: 'People & Work', items: [{ label: 'Employees', href: '/hr/employees', icon: UserCircle }, { label: 'Departments', href: '/hr/departments', icon: Building2 }, { label: 'Leave Requests', href: '/hr/leave-requests', icon: CalendarDays }, { label: 'Projects', href: '/projects', icon: FolderOpen }] },
  { label: 'Finance', items: [{ label: 'Accounts', href: '/finance/accounts', icon: DollarSign }, { label: 'Journal Entries', href: '/finance/journal-entries', icon: BookOpen }] },
  { label: 'Administration', items: [{ label: 'Settings', href: '/settings', icon: Settings }] },
]

export function Sidebar() {
  const pathname = usePathname()
  const logout = useAuthStore((s) => s.logout)

  return (
    <aside className="flex h-screen w-56 flex-col text-gray-100" style={{ backgroundColor: '#0B132B' }}>
      <div className="flex h-16 items-center gap-3 px-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <Image src="/sujex-logo.webp" alt="Sujex" width={32} height={32} className="shrink-0" />
        <span className="text-lg font-extrabold tracking-tight text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
          SUJEX
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {groups.map((group) => <div key={group.label} className="mb-2">
          <p className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">{group.label}</p>
          {group.items.map(({ label, href, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link key={href} href={href} className={cn(
              'flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors',
              active ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
            )} style={active ? { backgroundColor: 'rgba(18,184,166,0.15)', borderRight: '3px solid #12B8A6', color: '#12B8A6' } : undefined}>
              <Icon size={16} />
              {label}
            </Link>
          )
          })}
        </div>)}
      </nav>
      <button
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white border-t"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <LogOut size={16} /> Logout
      </button>
    </aside>
  )
}
