import {
  CircleDashed,
  Circle,
  CircleDot,
  CircleCheck,
  Minus,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Zap,
} from 'lucide-react'
import type { TaskStatus, TaskPriority } from '../../types/api.types'
import clsx from 'clsx'

// ─── Status Badge ──────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; Icon: React.FC<{ className?: string }>; color: string; bg: string }
> = {
  backlog: {
    label: 'Pendiente',
    Icon: CircleDashed,
    color: 'text-status-backlog',
    bg: 'bg-status-backlog/15',
  },
  todo: { label: 'Por hacer', Icon: Circle, color: 'text-status-todo', bg: 'bg-status-todo/15' },
  doing: {
    label: 'En curso',
    Icon: CircleDot,
    color: 'text-status-doing',
    bg: 'bg-status-doing/15',
  },
  done: { label: 'Hecho', Icon: CircleCheck, color: 'text-status-done', bg: 'bg-status-done/15' },
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  const { label, Icon, color, bg } = STATUS_CONFIG[status]
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium whitespace-nowrap',
        color,
        bg
      )}
    >
      <Icon className="w-3 h-3 flex-shrink-0" />
      {label}
    </span>
  )
}

// ─── Priority Badge ─────────────────────────────────────────────────────────

const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; Icon: React.FC<{ className?: string }>; color: string }
> = {
  none: { label: 'Sin prioridad', Icon: Minus, color: 'text-content-disabled' },
  low: { label: 'Baja', Icon: ChevronDown, color: 'text-priority-low' },
  medium: { label: 'Media', Icon: ChevronRight, color: 'text-priority-medium' },
  high: { label: 'Alta', Icon: ChevronUp, color: 'text-priority-high' },
  urgent: { label: 'Urgente', Icon: Zap, color: 'text-priority-urgent' },
}

interface PriorityBadgeProps {
  priority: TaskPriority
  showLabel?: boolean
  className?: string
}

export function PriorityBadge({ priority, showLabel = false, className }: PriorityBadgeProps) {
  const { label, Icon, color } = PRIORITY_CONFIG[priority]
  return (
    <span
      className={clsx('inline-flex items-center gap-1 text-xs whitespace-nowrap', color, className)}
      title={label}
    >
      <Icon className="w-3 h-3 flex-shrink-0" />
      {showLabel && <span className="capitalize">{label}</span>}
    </span>
  )
}

export { STATUS_CONFIG, PRIORITY_CONFIG }
