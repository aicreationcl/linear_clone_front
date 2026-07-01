import { describe, it, expect } from 'vitest'
import { toUITask, toUITasks } from '../../../src/lib/transformers/task.transformer'
import type { APITask } from '../../../src/types/api.types'

const baseAPITask: APITask = {
  id: 'task-1',
  title: 'Test task',
  description: 'A description',
  status: 'todo',
  priority: 'medium',
  project: 'project-1',
  reporter: 'user-1',
  order: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
}

describe('toUITask', () => {
  it('maps all required fields', () => {
    const result = toUITask(baseAPITask)
    expect(result.id).toBe('task-1')
    expect(result.title).toBe('Test task')
    expect(result.status).toBe('todo')
    expect(result.priority).toBe('medium')
    expect(result.projectId).toBe('project-1')
    expect(result.reporterId).toBe('user-1')
    expect(result.order).toBe(1)
  })

  it('converts ISO date strings to Date objects', () => {
    const result = toUITask(baseAPITask)
    expect(result.createdAt).toBeInstanceOf(Date)
    expect(result.updatedAt).toBeInstanceOf(Date)
    expect(result.createdAt.toISOString()).toBe('2026-01-01T00:00:00.000Z')
    expect(result.updatedAt.toISOString()).toBe('2026-01-02T00:00:00.000Z')
  })

  it('sets description to empty string when undefined', () => {
    const task = { ...baseAPITask, description: undefined }
    const result = toUITask(task)
    expect(result.description).toBe('')
  })

  it('sets dueDate to null when not present', () => {
    const result = toUITask(baseAPITask)
    expect(result.dueDate).toBeNull()
  })

  it('converts dueDate string to Date when present', () => {
    const task = { ...baseAPITask, dueDate: '2026-06-30T00:00:00.000Z' }
    const result = toUITask(task)
    expect(result.dueDate).toBeInstanceOf(Date)
    expect(result.dueDate?.toISOString()).toBe('2026-06-30T00:00:00.000Z')
  })

  it('sets assignee to null when not present', () => {
    const result = toUITask(baseAPITask)
    expect(result.assignee).toBeNull()
  })

  it('sets assignee to null when assignee is a string ID', () => {
    const task = { ...baseAPITask, assignee: 'user-2' }
    const result = toUITask(task)
    expect(result.assignee).toBeNull()
  })

  it('maps assignee object to UIUser when populated', () => {
    const task = {
      ...baseAPITask,
      assignee: { id: 'user-2', email: 'bob@example.com', name: 'Bob', createdAt: '2026-01-01T00:00:00.000Z' },
    }
    const result = toUITask(task)
    expect(result.assignee).not.toBeNull()
    expect(result.assignee?.id).toBe('user-2')
    expect(result.assignee?.name).toBe('Bob')
  })
})

describe('toUITasks', () => {
  it('maps an array of APITasks to UITasks', () => {
    const tasks = [baseAPITask, { ...baseAPITask, id: 'task-2', title: 'Second' }]
    const result = toUITasks(tasks)
    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('task-1')
    expect(result[1].id).toBe('task-2')
  })

  it('returns empty array for empty input', () => {
    expect(toUITasks([])).toEqual([])
  })
})
