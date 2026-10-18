'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, TrendingUp, Target, Package, Warehouse, ShoppingCart,
  FileText, UserCircle, DollarSign, FolderOpen, Settings, LogOut, Truck, ClipboardList
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const nav = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Contacts', href: '/crm/contacts', icon: Users },
  { label: 'Leads', href: '/crm/leads', icon: TrendingUp },
  { label: 'Opportunities', href: '/crm/opportunities', icon: Target },
  { label: 'Products', href: '/inventory/products', icon: Package },
  { label: 'Warehouses', href: '/inventory/warehouses', icon: Warehouse },
  { label: 'Sales Orders', href: '/sales/orders', icon: ShoppingCart },
  { label: 'Invoices', href: '/sales/invoices', icon: FileText },
  { label: 'Vendors', href: '/purchase/vendors', icon: Truck },
  { label: 'Purchase Orders', href: '/purchase/orders', icon: ClipboardList },
  { label: 'Employees', href: '/hr/employees', icon: UserCircle },
  { label: 'Finance', href: '/finance/accounts', icon: DollarSign },
  { label: 'Projects', href: '/projects', icon: FolderOpen },
  { label: 'Settings', href: '/settings', icon: Settings },
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
        {nav.map(({ label, href, icon: Icon }) => {
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
