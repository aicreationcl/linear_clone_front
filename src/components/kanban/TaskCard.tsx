import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { UITask } from '../../types/ui.types'
import type { TaskPriority } from '../../types/api.types'
import { PriorityBadge } from '../ui/Badge'
import Avatar from '../ui/Avatar'
import clsx from 'clsx'

const PRIORITY_STRIPE: Record<TaskPriority, string> = {
  none: 'transparent',
  low: '#4b5563',
  medium: '#d97706',
  high: '#ea580c',
  urgent: '#dc2626',
}

interface Props {
  task: UITask
  onClick: () => void
}

export default function TaskCard({ task, onClick }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        background: isDragging
          ? 'rgba(30,30,36,0.6)'
          : 'linear-gradient(160deg, #1e1e24 0%, #19191f 100%)',
        border: `1px solid ${isDragging ? 'rgba(94,106,210,0.3)' : 'rgba(42,42,50,0.8)'}`,
        boxShadow: isDragging
          ? '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(94,106,210,0.2)'
          : '0 1px 4px rgba(0,0,0,0.3)',
      }}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={clsx(
        'flex overflow-hidden rounded-md select-none cursor-pointer',
        'transition-all duration-150',
        isDragging ? 'opacity-40 rotate-1' : 'hover:-translate-y-px'
      )}
      onMouseEnter={(e) => {
        if (!isDragging) {
          const el = e.currentTarget as HTMLElement
          el.style.boxShadow = '0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px rgba(60,60,70,0.9)'
          el.style.borderColor = 'rgba(60,60,70,0.9)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          const el = e.currentTarget as HTMLElement
          el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)'
          el.style.borderColor = 'rgba(42,42,50,0.8)'
        }
      }}
    >
      {/* Priority stripe */}
      <div
        className="w-0.5 flex-shrink-0"
        style={{ backgroundColor: PRIORITY_STRIPE[task.priority] }}
      />

      {/* Card body */}
      <div className="flex-1 p-3 min-w-0">
        <p className="text-content-primary text-[13px] leading-snug mb-2.5 line-clamp-2 font-medium">
          {task.title}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          <PriorityBadge priority={task.priority} showLabel />

          {task.dueDate && (
            <span
              className="text-content-disabled text-[11px]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {task.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}

          {task.assignee && <Avatar name={task.assignee.name} size="sm" className="ml-auto" />}
        </div>
      </div>
    </div>
  )
}
