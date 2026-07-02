import type { TaskStatus, TaskPriority, APIUser } from './api.types'

export interface UIUser {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface UIProject {
  id: string
  name: string
  description?: string
  identifier: string
  color: string
  owner: string | UIUser
  members: (string | UIUser)[]
  createdAt: Date
  updatedAt: Date
}

export interface UITask {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  projectId: string
  assignee: UIUser | null
  reporterId: string
  dueDate: Date | null
  order: number
  createdAt: Date
  updatedAt: Date
}

export type ViewMode = 'kanban' | 'list'

export interface FilterState {
  status: TaskStatus | null
  priority: TaskPriority | null
  assigneeId: string | null
}

export function isAPIUser(v: unknown): v is APIUser {
  return typeof v === 'object' && v !== null && 'email' in v
}

export function isUIUser(v: string | UIUser): v is UIUser {
  return typeof v === 'object'
}
