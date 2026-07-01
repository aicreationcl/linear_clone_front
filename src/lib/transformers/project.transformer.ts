import type { APIProject } from '../../types/api.types'
import type { UIProject } from '../../types/ui.types'

export function toUIProject(api: APIProject): UIProject {
  return {
    id: api.id,
    name: api.name,
    description: api.description,
    identifier: api.identifier,
    color: api.color ?? '#5e6ad2',
    owner: api.owner,
    members: api.members,
    createdAt: new Date(api.createdAt),
    updatedAt: new Date(api.updatedAt),
  }
}

export function toUIProjects(projects: APIProject[]): UIProject[] {
  return projects.map(toUIProject)
}
