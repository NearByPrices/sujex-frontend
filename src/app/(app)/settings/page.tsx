import Link from 'next/link'

const sections = [
  { href: '/settings/company', label: 'Company', description: 'Name, address, tax number and contact details' },
  { href: '/settings/users', label: 'Users', description: 'Manage user accounts and access' },
  { href: '/settings/roles', label: 'Roles & Permissions', description: 'Define roles and what each can do' },
]

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      <div className="grid gap-4 max-w-xl">
        {sections.map((s) => (
          <Link key={s.href} href={s.href} className="rounded-lg bg-white p-5 shadow-sm border border-gray-100 hover:border-blue-300 transition-colors">
            <p className="font-semibold text-gray-900">{s.label}</p>
            <p className="text-sm text-gray-500 mt-1">{s.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
