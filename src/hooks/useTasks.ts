import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { toUITask, toUITasks } from '../lib/transformers/task.transformer'
import type {
  APITask,
  ListResponse,
  ItemResponse,
  TaskStatus,
  TaskPriority,
} from '../types/api.types'

export const tasksKey = (projectId: string) => ['tasks', projectId] as const

interface CreateTaskInput {
  title: string
  projectId: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  assigneeId?: string
  dueDate?: string
}

interface UpdateTaskInput {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  assigneeId?: string
  dueDate?: string | null
}

export function useTasks(projectId: string, filters?: Record<string, string>) {
  return useQuery({
    queryKey: tasksKey(projectId),
    queryFn: async () => {
      const params = new URLSearchParams({ projectId, ...filters })
      const res = await api.get<ListResponse<APITask>>(`/tasks?${params}`)
      return toUITasks(res.data.data)
    },
    enabled: !!projectId,
  })
}

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateTaskInput) => {
      const res = await api.post<ItemResponse<APITask>>('/tasks', data)
      return toUITask(res.data.data)
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: tasksKey(vars.projectId) }),
  })
}

export function useUpdateTask(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTaskInput }) => {
      const res = await api.patch<ItemResponse<APITask>>(`/tasks/${id}`, data)
      return toUITask(res.data.data)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: tasksKey(projectId) }),
  })
}

export function useUpdateTaskStatus(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      status,
      order,
    }: {
      id: string
      status: TaskStatus
      order?: number
    }) => {
      const res = await api.patch<ItemResponse<APITask>>(`/tasks/${id}/status`, { status, order })
      return toUITask(res.data.data)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: tasksKey(projectId) }),
  })
}

export function useDeleteTask(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: tasksKey(projectId) }),
  })
}
