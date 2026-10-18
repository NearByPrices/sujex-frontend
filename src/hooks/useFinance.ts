import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { ApiResponse, Account, JournalEntry, SalesInvoice } from '@/types/api'

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Account[]>>('/api/v1/finance/accounts')
      return res.data.data
    },
  })
}

export function useJournalEntries(page = 1) {
  return useQuery({
    queryKey: ['journal-entries', page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '20' })
      const res = await api.get<ApiResponse<JournalEntry[]>>(`/api/v1/finance/journal-entries?${params}`)
      return res.data
    },
  })
}

export function useSalesInvoices(page = 1, search?: string) {
  return useQuery({
    queryKey: ['sales-invoices', page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '20' })
      if (search) params.set('search', search)
      const res = await api.get<ApiResponse<SalesInvoice[]>>(`/api/v1/sales/invoices?${params}`)
      return res.data
    },
  })
}
