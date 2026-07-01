import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { toUIProject, toUIProjects } from '../lib/transformers/project.transformer'
import type { APIProject, ListResponse, ItemResponse } from '../types/api.types'

export const PROJECTS_KEY = ['projects'] as const

export function useProjects() {
  return useQuery({
    queryKey: PROJECTS_KEY,
    queryFn: async () => {
      const res = await api.get<ListResponse<APIProject>>('/projects')
      return toUIProjects(res.data.data)
    },
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: async () => {
      const res = await api.get<ItemResponse<APIProject>>(`/projects/${id}`)
      return toUIProject(res.data.data)
    },
    enabled: !!id,
  })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      name: string
      identifier: string
      description?: string
      color?: string
    }) => {
      const res = await api.post<ItemResponse<APIProject>>('/projects', data)
      return toUIProject(res.data.data)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: PROJECTS_KEY }),
  })
}

export function useUpdateProject(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { name?: string; description?: string; color?: string }) => {
      const res = await api.patch<ItemResponse<APIProject>>(`/projects/${id}`, data)
      return toUIProject(res.data.data)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: PROJECTS_KEY }),
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/projects/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: PROJECTS_KEY }),
  })
}
