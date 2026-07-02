import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { UITask } from '../../types/ui.types'
import type { TaskStatus, TaskPriority } from '../../types/api.types'
import { useUpdateTaskStatus } from '../../hooks/useTasks'
import { useFilterStore } from '../../stores/filter.store'
import KanbanColumn from './KanbanColumn'
import { TaskCardOverlay } from './TaskCard'
import { PriorityBadge } from '../ui/Badge'
import clsx from 'clsx'

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: 'backlog', label: 'Pendiente' },
  { id: 'todo', label: 'Por hacer' },
  { id: 'doing', label: 'En curso' },
  { id: 'done', label: 'Hecho' },
]

const FILTER_PRIORITIES: TaskPriority[] = ['urgent', 'high', 'medium', 'low']

interface Props {
  tasks: UITask[]
  projectId: string
  onTaskClick: (taskId: string) => void
  onAddTask: (status: TaskStatus) => void
}

export default function KanbanBoard({ tasks, projectId, onTaskClick, onAddTask }: Props) {
  const updateStatus = useUpdateTaskStatus(projectId)
  const { filters, setFilter } = useFilterStore()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))
  const [activeTask, setActiveTask] = useState<UITask | null>(null)

  function handleDragStart(event: DragStartEvent) {
    setActiveTask(tasks.find((t) => t.id === event.active.id) ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null)
    const { active, over } = event
    if (!over || active.id === over.id) return
    const taskId = active.id as string
    const newStatus = over.id as TaskStatus
    if (COLUMNS.some((c) => c.id === newStatus)) {
      updateStatus.mutate({ id: taskId, status: newStatus })
    }
  }

  const filtered = filters.priority ? tasks.filter((t) => t.priority === filters.priority) : tasks

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Filter toolbar */}
      <div
        className="flex items-center gap-1.5 px-6 py-2 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(42,42,50,0.7)' }}
      >
        <span
          className="text-content-disabled text-[11px] mr-1 font-semibold uppercase tracking-[0.06em]"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Filtrar
        </span>
        {FILTER_PRIORITIES.map((p) => (
          <button
            key={p}
            onClick={() => setFilter('priority', filters.priority === p ? null : p)}
            className={clsx(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-all duration-100',
              filters.priority === p
                ? 'bg-surface-elevated border border-surface-border text-content-primary'
                : 'text-content-secondary hover:text-content-primary hover:bg-surface-elevated border border-transparent'
            )}
          >
            <PriorityBadge priority={p} showLabel />
          </button>
        ))}
        {filters.priority && (
          <button
            onClick={() => setFilter('priority', null)}
            className="ml-1 text-content-disabled text-xs hover:text-content-secondary transition-colors"
          >
            ✕ Limpiar
          </button>
        )}
      </div>

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveTask(null)}
      >
        <div className="flex gap-4 p-6 flex-1 overflow-x-auto board-bg scrollbar-thin">
          {COLUMNS.map((col) => {
            const columnTasks = filtered.filter((t) => t.status === col.id)
            return (
              <SortableContext
                key={col.id}
                items={columnTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <KanbanColumn
                  id={col.id}
                  label={col.label}
                  tasks={columnTasks}
                  onTaskClick={onTaskClick}
                  onAddTask={() => onAddTask(col.id)}
                />
              </SortableContext>
            )
          })}
        </div>
        <DragOverlay>{activeTask && <TaskCardOverlay task={activeTask} />}</DragOverlay>
      </DndContext>
    </div>
  )
}
