import { useState } from 'react'
import type { UITask } from '../../types/ui.types'
import type { TaskPriority, TaskStatus } from '../../types/api.types'
import { StatusBadge, PriorityBadge } from '../ui/Badge'
import Avatar from '../ui/Avatar'
import { ChevronUp, ChevronDown } from 'lucide-react'
import clsx from 'clsx'

type SortKey = 'title' | 'status' | 'priority' | 'dueDate'
type SortDir = 'asc' | 'desc'

const STATUS_ORDER: Record<TaskStatus, number> = { backlog: 0, todo: 1, doing: 2, done: 3 }
const PRIORITY_ORDER: Record<TaskPriority, number> = {
  none: 0,
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
}

interface Props {
  tasks: UITask[]
  projectId: string
  onTaskClick: (taskId: string) => void
  onAddTask: () => void
}

export default function ListView({ tasks, onTaskClick, onAddTask }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('status')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = [...tasks].sort((a, b) => {
    let result = 0
    if (sortKey === 'title') result = a.title.localeCompare(b.title)
    else if (sortKey === 'status') result = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
    else if (sortKey === 'priority')
      result = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    else if (sortKey === 'dueDate') {
      const at = a.dueDate?.getTime() ?? Infinity
      const bt = b.dueDate?.getTime() ?? Infinity
      result = at - bt
    }
    return sortDir === 'asc' ? result : -result
  })

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <p className="text-content-secondary text-sm">Sin tareas en este proyecto</p>
        <button
          onClick={onAddTask}
          className="bg-accent-violet hover:bg-accent-violet-hover text-white text-xs px-3 py-1.5 rounded transition-colors"
        >
          Crear tarea
        </button>
      </div>
    )
  }

  function SortHeader({
    col,
    label,
    className,
  }: {
    col: SortKey
    label: string
    className?: string
  }) {
    const active = sortKey === col
    return (
      <th className={clsx('text-left font-medium pb-2 pr-4 select-none', className)}>
        <button
          onClick={() => handleSort(col)}
          className={clsx(
            'flex items-center gap-1 hover:text-content-secondary transition-colors',
            active ? 'text-content-secondary' : 'text-content-disabled'
          )}
        >
          {label}
          {active ? (
            sortDir === 'asc' ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )
          ) : (
            <ChevronDown className="w-3 h-3 opacity-0" />
          )}
        </button>
      </th>
    )
  }

  return (
    <div className="overflow-auto h-full">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-surface">
          <tr className="text-xs border-b border-surface-border">
            <SortHeader col="title" label="Título" />
            <SortHeader col="status" label="Estado" className="w-32" />
            <SortHeader col="priority" label="Prioridad" className="w-28" />
            <SortHeader col="dueDate" label="Fecha límite" className="w-28" />
            <th className="text-left font-medium pb-2 w-20 text-content-disabled">Asignado</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((task) => (
            <tr
              key={task.id}
              onClick={() => onTaskClick(task.id)}
              className="border-b border-surface-border/50 hover:bg-surface-overlay cursor-pointer transition-colors group"
            >
              <td className="py-2 pr-4">
                <span className="text-content-primary group-hover:text-content-primary">
                  {task.title}
                </span>
              </td>
              <td className="py-2 pr-4">
                <StatusBadge status={task.status} />
              </td>
              <td className="py-2 pr-4">
                <PriorityBadge priority={task.priority} showLabel />
              </td>
              <td className="py-2 pr-4">
                <span className="text-content-disabled text-xs tabular-nums">
                  {task.dueDate
                    ? task.dueDate.toLocaleDateString('es-CL', { month: 'short', day: 'numeric' })
                    : '—'}
                </span>
              </td>
              <td className="py-2">
                {task.assignee && <Avatar name={task.assignee.name} size="sm" />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
