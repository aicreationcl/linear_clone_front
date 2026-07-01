import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjects, useCreateProject } from '../../hooks/useProjects'
import { toast } from '../../stores/toast.store'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import type { AxiosError } from 'axios'

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useProjects()
  const createProject = useCreateProject()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [error, setError] = useState('')

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const project = await createProject.mutateAsync({ name, identifier })
      toast.success('Project created')
      setShowForm(false)
      setName('')
      setIdentifier('')
      navigate(`/projects/${project.id}`)
    } catch (err) {
      const e = err as AxiosError<{ error: string }>
      setError(e.response?.data?.error ?? 'Failed to create project')
      toast.error('Failed to create project')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-content-secondary text-sm">Loading…</div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-content-primary">Projects</h1>
        {!showForm && (
          <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
            New project
          </Button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 p-4 bg-surface-overlay border border-surface-border rounded-md space-y-3"
        >
          <h2 className="text-content-primary text-sm font-medium">Create project</h2>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-400/8 border border-red-400/20 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <Input
            autoFocus
            label="Project name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (!identifier) setIdentifier(e.target.value.slice(0, 3).toUpperCase())
            }}
            placeholder="My project"
            required
          />

          <Input
            label="Identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value.toUpperCase())}
            placeholder="e.g. LIN"
            required
            maxLength={5}
            className="uppercase"
          />

          <div className="flex gap-2 justify-end pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowForm(false)
                setError('')
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={createProject.isPending}>
              Create
            </Button>
          </div>
        </form>
      )}

      {projects.length === 0 ? (
        <p className="text-content-secondary text-sm">No projects yet. Create your first one.</p>
      ) : (
        <ul className="space-y-2">
          {projects.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => navigate(`/projects/${p.id}`)}
                className="w-full text-left flex items-center gap-3 p-3 bg-surface-overlay hover:bg-surface-elevated border border-surface-border rounded-md transition-colors"
              >
                <span
                  className="w-4 h-4 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: p.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-content-primary text-sm font-medium">{p.name}</p>
                  {p.description && (
                    <p className="text-content-secondary text-xs mt-0.5 truncate">
                      {p.description}
                    </p>
                  )}
                </div>
                <span className="ml-auto text-content-disabled text-xs font-mono">
                  {p.identifier}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
