import type { APIProject } from '../../types/api.types'
import type { UIProject, UIUser } from '../../types/ui.types'
import { isAPIUser } from '../../types/ui.types'

function toUIMember(member: string | { id: string; email: string; name: string; avatar?: string }): string | UIUser {
  if (isAPIUser(member)) {
    return { id: member.id, email: member.email, name: member.name, avatar: member.avatar }
  }
  return member
}

export function toUIProject(api: APIProject): UIProject {
  return {
    id: api.id,
    name: api.name,
    description: api.description,
    identifier: api.identifier,
    color: api.color ?? '#5e6ad2',
    owner: toUIMember(api.owner),
    members: api.members.map(toUIMember),
    createdAt: new Date(api.createdAt),
    updatedAt: new Date(api.updatedAt),
  }
}

export function toUIProjects(projects: APIProject[]): UIProject[] {
  return projects.map(toUIProject)
}
