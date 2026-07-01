import { describe, it, expect } from 'vitest'
import { toUIProject, toUIProjects } from '../../../src/lib/transformers/project.transformer'
import type { APIProject } from '../../../src/types/api.types'

const baseAPIProject: APIProject = {
  id: 'project-1',
  name: 'My Project',
  description: 'A test project',
  identifier: 'MP',
  color: '#5e6ad2',
  owner: 'user-1',
  members: ['user-1', 'user-2'],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
}

describe('toUIProject', () => {
  it('maps all required fields', () => {
    const result = toUIProject(baseAPIProject)
    expect(result.id).toBe('project-1')
    expect(result.name).toBe('My Project')
    expect(result.identifier).toBe('MP')
    expect(result.owner).toBe('user-1')
    expect(result.members).toEqual(['user-1', 'user-2'])
  })

  it('converts ISO date strings to Date objects', () => {
    const result = toUIProject(baseAPIProject)
    expect(result.createdAt).toBeInstanceOf(Date)
    expect(result.updatedAt).toBeInstanceOf(Date)
    expect(result.createdAt.toISOString()).toBe('2026-01-01T00:00:00.000Z')
  })

  it('uses provided color when present', () => {
    const result = toUIProject(baseAPIProject)
    expect(result.color).toBe('#5e6ad2')
  })

  it('falls back to default color when color is undefined', () => {
    const project = { ...baseAPIProject, color: undefined }
    const result = toUIProject(project)
    expect(result.color).toBe('#5e6ad2')
  })

  it('passes through optional description', () => {
    const result = toUIProject(baseAPIProject)
    expect(result.description).toBe('A test project')
  })

  it('handles missing description', () => {
    const project = { ...baseAPIProject, description: undefined }
    const result = toUIProject(project)
    expect(result.description).toBeUndefined()
  })
})

describe('toUIProjects', () => {
  it('maps an array of APIProjects to UIProjects', () => {
    const projects = [baseAPIProject, { ...baseAPIProject, id: 'project-2', name: 'Second' }]
    const result = toUIProjects(projects)
    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('project-1')
    expect(result[1].id).toBe('project-2')
  })

  it('returns empty array for empty input', () => {
    expect(toUIProjects([])).toEqual([])
  })
})
