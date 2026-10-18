import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { ApiResponse, Project, ProjectTask } from '@/types/api'

export function useProjects(page = 1, search?: string) {
  return useQuery({
    queryKey: ['projects', page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '20' })
      if (search) params.set('search', search)
      const res = await api.get<ApiResponse<Project[]>>(`/api/v1/projects?${params}`)
      return res.data
    },
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Project>>(`/api/v1/projects/${id}`)
      return res.data.data
    },
    enabled: !!id,
  })
}

export function useProjectTasks(projectId: string) {
  return useQuery({
    queryKey: ['project-tasks', projectId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<ProjectTask[]>>(`/api/v1/projects/${projectId}/tasks`)
      return res.data.data
    },
    enabled: !!projectId,
  })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post('/api/v1/projects', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  })
}

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: Record<string, unknown> }) =>
      api.post(`/api/v1/projects/${projectId}/tasks`, data),
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ['project-tasks', vars.projectId] }),
  })
}
