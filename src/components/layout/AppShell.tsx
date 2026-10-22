'use client'

import { Sidebar } from './Sidebar'
import { PageGuide } from '@/components/ui/page-guide'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.replace(`/login?returnTo=${encodeURIComponent(pathname)}`)
      return
    }
    setReady(true)
  }, [pathname, router])

  if (!ready) return null

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <PageGuide />
        {children}
      </main>
    </div>
  )
}
