import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { ApiResponse, Product, Warehouse } from '@/types/api'

export function useProducts(page = 1, search?: string) {
  return useQuery({
    queryKey: ['products', page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '20' })
      if (search) params.set('search', search)
      const res = await api.get<ApiResponse<Product[]>>(`/api/v1/products?${params}`)
      return res.data
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
      return res.data
    },
  })
}

export function useCreateStockMovement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => api.post('/api/v1/stock-movements', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
}
