import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { ApiResponse, Company } from '@/types/api'

export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Company[]>>('/api/v1/companies')
      return response.data.data ?? []
    },
  })
}
