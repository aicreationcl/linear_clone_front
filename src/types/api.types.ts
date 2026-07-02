export type TaskStatus = 'backlog' | 'todo' | 'doing' | 'done'
export type TaskPriority = 'none' | 'low' | 'medium' | 'high' | 'urgent'

export interface APIUser {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
}

export interface APIProject {
  id: string
  name: string
  description?: string
  identifier: string
  color?: string
  owner: string | APIUser
  members: (string | APIUser)[]
  createdAt: string
  updatedAt: string
}

export interface APITask {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  project: string
  assignee?: string | APIUser
  reporter: string
  dueDate?: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  token: string
  user: APIUser
}

export interface ListResponse<T> {
  data: T[]
}

export interface ItemResponse<T> {
  data: T
}
