import { http, HttpResponse } from 'msw'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'

const mockUser = {
  id: 'user-1',
  email: 'dev@example.com',
  name: 'Dev User',
  createdAt: '2026-01-01T00:00:00.000Z',
}

const mockProject = {
  id: 'project-1',
  name: 'Linear Clone',
  description: 'A Linear-inspired project manager',
  identifier: 'LC',
  color: '#5e6ad2',
  owner: mockUser,
  members: [mockUser],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

const mockTasks = [
  {
    id: 'task-1',
    title: 'Set up project',
    description: 'Initialize the MERN stack',
    status: 'done',
    priority: 'high',
    project: 'project-1',
    reporter: 'user-1',
    order: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'task-2',
    title: 'Build Kanban board',
    description: 'Implement drag-and-drop with dnd-kit',
    status: 'doing',
    priority: 'urgent',
    project: 'project-1',
    reporter: 'user-1',
    order: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
]

export const handlers = [
  http.post(`${API_URL}/auth/register`, () => {
    return HttpResponse.json(
      {
        token: 'mock-jwt-token',
        user: mockUser,
      },
      { status: 201 }
    )
  }),

  http.post(`${API_URL}/auth/login`, () => {
    return HttpResponse.json({
      token: 'mock-jwt-token',
      user: mockUser,
    })
  }),

  http.get(`${API_URL}/auth/me`, () => {
    return HttpResponse.json({ data: mockUser })
  }),

  http.get(`${API_URL}/projects`, () => {
    return HttpResponse.json({ data: [mockProject] })
  }),

  http.post(`${API_URL}/projects`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json(
      {
        data: {
          ...mockProject,
          id: `project-${Date.now()}`,
          name: body.name ?? 'New Project',
          identifier: body.identifier ?? 'NP',
        },
      },
      { status: 201 }
    )
  }),

  http.get(`${API_URL}/projects/:id`, ({ params }) => {
    return HttpResponse.json({
      data: { ...mockProject, id: params.id },
    })
  }),

  http.patch(`${API_URL}/projects/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json({ data: { ...mockProject, ...body, id: params.id } })
  }),

  http.delete(`${API_URL}/projects/:id`, () => {
    return HttpResponse.json({ message: 'Project deleted' })
  }),

  http.get(`${API_URL}/tasks`, () => {
    return HttpResponse.json({ data: mockTasks })
  }),

  http.get(`${API_URL}/tasks/:id`, ({ params }) => {
    const task = mockTasks.find((t) => t.id === params.id) ?? mockTasks[0]
    return HttpResponse.json({ data: { ...task, id: params.id } })
  }),

  http.post(`${API_URL}/tasks`, async ({ request }) => {
    const { assigneeId, ...body } = (await request.json()) as Record<string, unknown>
    return HttpResponse.json(
      {
        data: {
          id: `task-${Date.now()}`,
          title: body.title ?? 'New Task',
          description: body.description ?? '',
          status: body.status ?? 'backlog',
          priority: body.priority ?? 'none',
          project: body.project ?? 'project-1',
          assignee: assigneeId ? mockUser : undefined,
          dueDate: body.dueDate,
          reporter: 'user-1',
          order: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    )
  }),

  http.patch(`${API_URL}/tasks/:id`, async ({ params, request }) => {
    const { assigneeId, ...body } = (await request.json()) as Record<string, unknown>
    const task = mockTasks.find((t) => t.id === params.id) ?? mockTasks[0]
    return HttpResponse.json({
      data: {
        ...task,
        ...body,
        assignee: assigneeId ? mockUser : undefined,
        id: params.id,
      },
    })
  }),

  http.patch(`${API_URL}/tasks/:id/status`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const task = mockTasks.find((t) => t.id === params.id) ?? mockTasks[0]
    return HttpResponse.json({ data: { ...task, ...body, id: params.id } })
  }),

  http.delete(`${API_URL}/tasks/:id`, () => {
    return HttpResponse.json({ data: null })
  }),
]
