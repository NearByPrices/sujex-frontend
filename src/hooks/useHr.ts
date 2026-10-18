import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { ApiResponse, Employee, Department, LeaveRequest } from '@/types/api'

export function useEmployees(page = 1, search?: string) {
  return useQuery({
    queryKey: ['employees', page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '20' })
      if (search) params.set('search', search)
      const res = await api.get<ApiResponse<{ items: Employee[]; pagination: unknown }>>(`/api/v1/hr/employees?${params}`)
      return { data: res.data.data?.items ?? [], pagination: res.data.pagination }
    },
  })
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Employee>>(`/api/v1/hr/employees/${id}`)
      return res.data.data
    },
    enabled: !!id,
  })
}

export function useCreateEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post('/api/v1/hr/employees', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }),
  })
}

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Department[]>>('/api/v1/hr/departments')
      return res.data.data
    },
  })
}

export function useCreateDepartment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post('/api/v1/hr/departments', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  })
}

export function useLeaveRequests(page = 1) {
  return useQuery({
    queryKey: ['leave-requests', page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '20' })
      const res = await api.get<ApiResponse<{ items: LeaveRequest[]; pagination: unknown }>>(`/api/v1/hr/leave-requests?${params}`)
      return { data: res.data.data?.items ?? [], pagination: res.data.pagination }
    },
  })
}
