import { useParams } from 'react-router-dom'
import { useProject } from '../../hooks/useProjects'
import { useTasks } from '../../hooks/useTasks'
import { useUIStore } from '../../stores/ui.store'
import type { TaskStatus } from '../../types/api.types'
import KanbanBoard from '../../components/kanban/KanbanBoard'
import ListView from '../../components/list/ListView'
import TaskModal from '../../components/tasks/TaskModal'
import clsx from 'clsx'

export default function ProjectDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const { data: project, isLoading: projectLoading } = useProject(id)
  const { data: tasks = [], isLoading: tasksLoading } = useTasks(id)
  const { viewMode, setViewMode, isTaskModalOpen, openTaskModal, closeTaskModal, selectedTaskId } =
    useUIStore()

  function handleAddTask(status?: TaskStatus) {
    openTaskModal(undefined, status)
  }

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center h-full text-content-secondary text-sm">
        Loading…
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full text-content-secondary text-sm">
        Project not found
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
              Board
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
              List
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
            New task
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        {tasksLoading ? (
          <div className="flex items-center justify-center h-full text-content-secondary text-sm">
            Loading tasks…
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
        <TaskModal projectId={id} taskId={selectedTaskId ?? undefined} onClose={closeTaskModal} />
      )}
    </div>
  )
}
