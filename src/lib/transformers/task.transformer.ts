import type { APITask } from '../../types/api.types'
import type { UITask, UIUser } from '../../types/ui.types'
import { isAPIUser } from '../../types/ui.types'

function toUIUser(user: unknown): UIUser | null {
  if (!isAPIUser(user)) return null
  return { id: user.id, email: user.email, name: user.name, avatar: user.avatar }
}

export function toUITask(api: APITask): UITask {
  return {
    id: api.id,
    title: api.title,
    description: api.description ?? '',
    status: api.status,
    priority: api.priority,
    projectId: api.project,
    assignee: typeof api.assignee === 'object' ? toUIUser(api.assignee) : null,
    reporterId: typeof api.reporter === 'string' ? api.reporter : '',
    dueDate: api.dueDate ? new Date(api.dueDate) : null,
    order: api.order,
    createdAt: new Date(api.createdAt),
    updatedAt: new Date(api.updatedAt),
  }
}

export function toUITasks(tasks: APITask[]): UITask[] {
  return tasks.map(toUITask)
}
