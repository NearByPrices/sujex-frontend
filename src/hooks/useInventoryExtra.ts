import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { ApiResponse, ProductCategory, StockMovement } from '@/types/api'

export function useProductCategories() {
  return useQuery({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<ProductCategory[]>>('/api/v1/inventory/categories')
      return res.data.data
    },
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post('/api/v1/inventory/categories', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['product-categories'] }),
  })
}

export function useStockMovements(page = 1, productId?: string, warehouseId?: string) {
  return useQuery({
    queryKey: ['stock-movements', page, productId, warehouseId],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '20' })
      if (productId) params.set('productId', productId)
      if (warehouseId) params.set('warehouseId', warehouseId)
      const res = await api.get<ApiResponse<StockMovement[]>>(`/api/v1/inventory/stock-movements?${params}`)
      return res.data
    },
  })
}

export function useCreateStockMovement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post('/api/v1/inventory/stock-movements', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['stock-movements'] })
      qc.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
