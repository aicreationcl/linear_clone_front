import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { useProject, useUpdateProject, useDeleteProject } from '../../hooks/useProjects'
import { useTasks } from '../../hooks/useTasks'
import { useUIStore } from '../../stores/ui.store'
import { toast } from '../../stores/toast.store'
import type { TaskStatus } from '../../types/api.types'
import { isUIUser } from '../../types/ui.types'
import KanbanBoard from '../../components/kanban/KanbanBoard'
import ListView from '../../components/list/ListView'
import TaskModal from '../../components/tasks/TaskModal'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import clsx from 'clsx'

export default function ProjectDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: project, isLoading: projectLoading } = useProject(id)
  const { data: tasks = [], isLoading: tasksLoading } = useTasks(id)
  const { viewMode, setViewMode, isTaskModalOpen, openTaskModal, closeTaskModal, selectedTaskId } =
    useUIStore()
  const updateProject = useUpdateProject(id)
  const deleteProject = useDeleteProject()

  const [menuOpen, setMenuOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('#5e6ad2')

  function handleAddTask(status?: TaskStatus) {
    openTaskModal(undefined, status)
  }

  function openEdit() {
    if (!project) return
    setEditName(project.name)
    setEditColor(project.color)
    setEditing(true)
    setMenuOpen(false)
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await updateProject.mutateAsync({ name: editName, color: editColor })
      toast.success('Proyecto actualizado')
      setEditing(false)
    } catch {
      toast.error('Error al actualizar el proyecto')
    }
  }

  async function handleDelete() {
    setMenuOpen(false)
    if (!window.confirm('¿Eliminar este proyecto? Esta acción no se puede deshacer.')) return
    try {
      await deleteProject.mutateAsync(id)
      toast.success('Proyecto eliminado')
      navigate('/projects')
    } catch {
      toast.error('Error al eliminar el proyecto')
    }
  }

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center h-full text-content-secondary text-sm">
        Cargando…
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full text-content-secondary text-sm">
        Proyecto no encontrado
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <header
        className="flex items-center gap-4 px-6 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(42,42,50,0.7)' }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="w-3 h-3 rounded-sm flex-shrink-0"
            style={{
              backgroundColor: project.color,
              boxShadow: `0 0 6px ${project.color}55`,
            }}
          />
          <h1 className="text-content-primary font-semibold text-sm">{project.name}</h1>
          <span
            className="text-content-disabled text-[11px] font-medium px-1.5 py-0.5 rounded"
            style={{
              fontFamily: 'var(--font-mono)',
              background: 'rgba(42,42,50,0.5)',
              border: '1px solid rgba(42,42,50,0.8)',
            }}
          >
            {project.identifier}
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Opciones del proyecto"
              className="text-content-disabled hover:text-content-secondary transition-colors p-1"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {menuOpen && (
              <div className="absolute top-full left-0 mt-1 z-10 bg-surface-elevated border border-surface-border rounded shadow-dropdown py-1 min-w-40">
                <button
                  type="button"
                  onClick={openEdit}
                  className="w-full text-left px-3 py-1.5 text-xs text-content-secondary hover:bg-surface-border hover:text-content-primary transition-colors"
                >
                  Editar proyecto
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-surface-border transition-colors"
                >
                  Eliminar proyecto
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div
            className="flex rounded-md p-0.5"
            style={{ background: 'rgba(30,30,36,0.8)', border: '1px solid rgba(42,42,50,0.8)' }}
          >
            <button
              onClick={() => setViewMode('kanban')}
              className={clsx(
                'px-3 py-1 text-xs rounded transition-all duration-100',
                viewMode === 'kanban'
                  ? 'bg-surface-elevated text-content-primary shadow-sm'
                  : 'text-content-disabled hover:text-content-secondary'
              )}
            >
              Tablero
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={clsx(
                'px-3 py-1 text-xs rounded transition-all duration-100',
                viewMode === 'list'
                  ? 'bg-surface-elevated text-content-primary shadow-sm'
                  : 'text-content-disabled hover:text-content-secondary'
              )}
            >
              Lista
            </button>
          </div>
          <button
            onClick={() => handleAddTask()}
            className="text-white text-xs px-3 py-1.5 rounded-md transition-all duration-100 font-medium"
            style={{
              background: 'linear-gradient(135deg, #6370d8 0%, #5160c8 100%)',
              boxShadow: '0 0 8px rgba(94,106,210,0.3)',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 14px rgba(94,106,210,0.5)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 8px rgba(94,106,210,0.3)'
            }}
          >
            Nueva tarea
          </button>
        </div>
      </header>

      {editing && (
        <form
          onSubmit={handleSaveEdit}
          className="flex items-end gap-3 px-6 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(42,42,50,0.7)' }}
        >
          <Input
            label="Nombre del proyecto"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
            className="max-w-xs"
          />
          <div className="flex flex-col gap-1">
            <label className="text-content-secondary text-xs font-medium">Color</label>
            <input
              type="color"
              value={editColor}
              onChange={(e) => setEditColor(e.target.value)}
              className="h-9 w-14 bg-surface-elevated border border-surface-border rounded cursor-pointer"
            />
          </div>
          <div className="flex gap-2 ml-auto">
            <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={updateProject.isPending}>
              Guardar
            </Button>
          </div>
        </form>
      )}

      <div className="flex-1 overflow-hidden">
        {tasksLoading ? (
          <div className="flex items-center justify-center h-full text-content-secondary text-sm">
            Cargando tareas…
          </div>
        ) : viewMode === 'kanban' ? (
          <KanbanBoard
            tasks={tasks}
            projectId={id}
            onTaskClick={(taskId) => openTaskModal(taskId)}
            onAddTask={handleAddTask}
          />
        ) : (
          <ListView
            tasks={tasks}
            projectId={id}
            onTaskClick={(taskId) => openTaskModal(taskId)}
            onAddTask={() => handleAddTask()}
          />
        )}
      </div>

      {isTaskModalOpen && (
        <TaskModal
          projectId={id}
          taskId={selectedTaskId ?? undefined}
          members={project.members.filter(isUIUser)}
          onClose={closeTaskModal}
        />
      )}
    </div>
  )
}
