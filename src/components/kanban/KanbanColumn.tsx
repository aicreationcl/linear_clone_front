import { useDroppable } from '@dnd-kit/core'
import type { UITask } from '../../types/ui.types'
import type { TaskStatus } from '../../types/api.types'
import TaskCard from './TaskCard'
import clsx from 'clsx'
import { Plus } from 'lucide-react'

const STATUS_DOT: Record<TaskStatus, string> = {
  backlog: 'bg-status-backlog',
  todo: 'bg-status-todo',
  doing: 'bg-status-doing',
  done: 'bg-status-done',
}

interface Props {
  id: TaskStatus
  label: string
  tasks: UITask[]
  onTaskClick: (taskId: string) => void
  onAddTask: () => void
}

export default function KanbanColumn({ id, label, tasks, onTaskClick, onAddTask }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div className="flex flex-col w-72 flex-shrink-0">
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className={clsx('w-2 h-2 rounded-full flex-shrink-0', STATUS_DOT[id])} />
        <span className="text-content-secondary text-xs font-medium">{label}</span>
        <span className="text-content-disabled text-xs tabular-nums">{tasks.length}</span>
        <button
          onClick={onAddTask}
          className="ml-auto p-0.5 text-content-disabled hover:text-content-secondary hover:bg-surface-elevated rounded transition-colors"
          title={`Add task to ${label}`}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={clsx(
          'flex-1 space-y-2 rounded-md p-1.5 transition-colors min-h-12',
          isOver ? 'bg-accent-violet/8 ring-1 ring-accent-violet/20' : 'bg-transparent'
        )}
      >
        {tasks.length === 0 && !isOver && (
          <p className="text-center text-content-disabled text-xs py-6 px-2">No tasks</p>
        )}
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task.id)} />
        ))}
      </div>
    </div>
  )
}
