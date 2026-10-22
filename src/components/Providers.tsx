'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60 * 1000, retry: 1 },
    },
  }))

  const [hasQueryError, setHasQueryError] = useState(false)

  useEffect(() => queryClient.getQueryCache().subscribe(() => {
    setHasQueryError(queryClient.getQueryCache().getAll().some(query => query.state.status === 'error'))
  }), [queryClient])

  return <QueryClientProvider client={queryClient}>
    {children}
    {hasQueryError && <div className="fixed bottom-4 right-4 z-50 flex max-w-sm items-center gap-3 rounded-lg border border-red-200 bg-white px-4 py-3 text-sm text-red-700 shadow-lg">
      <span>Some data could not be loaded. Check your connection.</span>
      <Button size="sm" variant="outline" onClick={() => queryClient.invalidateQueries()}>Retry</Button>
    </div>}
  </QueryClientProvider>
}
