import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { ApiResponse, Product, Warehouse, PagedResult } from '@/types/api'

export function useProducts(page = 1, search?: string) {
  return useQuery({
    queryKey: ['products', page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '20' })
      if (search) params.set('search', search)
      const res = await api.get<ApiResponse<PagedResult<Product>>>(`/api/v1/products?${params}`)
      return { data: Array.isArray(res.data.data) ? res.data.data : res.data.data?.items ?? [], pagination: res.data.pagination ?? res.data.data?.pagination }
    },
  })
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => api.post('/api/v1/products', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
}

export function useWarehouses() {
  return useQuery({
    queryKey: ['warehouses'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Warehouse[]>>('/api/v1/warehouses')
      return res.data.data
    },
  })
}

export function useCreateWarehouse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post('/api/v1/warehouses', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['warehouses'] }),
  })
}

export function useCreateStockMovement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => api.post('/api/v1/stock-movements', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
}
