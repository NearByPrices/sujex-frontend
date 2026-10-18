import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { ApiResponse, Contact, Lead, Opportunity } from '@/types/api'

export function useContacts(page = 1, search?: string) {
  return useQuery({
    queryKey: ['contacts', page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '20' })
      if (search) params.set('search', search)
      const res = await api.get<ApiResponse<Contact[]>>(`/api/v1/contacts?${params}`)
      return res.data
    },
  })
}

export function useCreateContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => api.post('/api/v1/contacts', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contacts'] }),
  })
}

export function useLeads(page = 1, search?: string) {
  return useQuery({
    queryKey: ['leads', page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '20' })
      if (search) params.set('search', search)
      const res = await api.get<ApiResponse<Lead[]>>(`/api/v1/leads?${params}`)
      return res.data
    },
  })
}

export function useCreateLead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => api.post('/api/v1/leads', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  })
}

export function useConvertLead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.post(`/api/v1/leads/${id}/convert`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] })
      qc.invalidateQueries({ queryKey: ['opportunities'] })
    },
  })
}

export function useOpportunities(page = 1, search?: string) {
  return useQuery({
    queryKey: ['opportunities', page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '20' })
      if (search) params.set('search', search)
      const res = await api.get<ApiResponse<Opportunity[]>>(`/api/v1/opportunities?${params}`)
      return res.data
    },
  })
}
