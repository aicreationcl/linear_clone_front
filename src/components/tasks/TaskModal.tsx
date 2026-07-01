import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useCreateTask, useUpdateTask, useDeleteTask } from '../../hooks/useTasks'
import { useUIStore } from '../../stores/ui.store'
import { toast } from '../../stores/toast.store'
import api from '../../lib/api'
import { toUITask } from '../../lib/transformers/task.transformer'
import type { UITask } from '../../types/ui.types'
import type { TaskStatus, TaskPriority, ItemResponse, APITask } from '../../types/api.types'
import { StatusBadge, PriorityBadge } from '../ui/Badge'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'
import clsx from 'clsx'

const STATUSES: TaskStatus[] = ['backlog', 'todo', 'doing', 'done']
const PRIORITIES: TaskPriority[] = ['none', 'low', 'medium', 'high', 'urgent']

const STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: 'Backlog',
  todo: 'To Do',
  doing: 'In Progress',
  done: 'Done',
}
const PRIORITY_LABELS: Record<TaskPriority, string> = {
  none: 'None',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

interface Props {
  projectId: string
  taskId?: string
  onClose: () => void
}

export default function TaskModal({ projectId, taskId, onClose }: Props) {
  const isEditing = !!taskId
  const { defaultTaskStatus } = useUIStore()

  const [task, setTask] = useState<UITask | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>(defaultTaskStatus ?? 'backlog')
  const [priority, setPriority] = useState<TaskPriority>('none')
  const [loading, setLoading] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [priorityOpen, setPriorityOpen] = useState(false)

  const createTask = useCreateTask()
  const updateTask = useUpdateTask(projectId)
  const deleteTask = useDeleteTask(projectId)

  useEffect(() => {
    if (taskId) {
      setLoading(true)
      api
        .get<ItemResponse<APITask>>(`/tasks/${taskId}`)
        .then((res) => {
          const t = toUITask(res.data.data)
          setTask(t)
          setTitle(t.title)
          setDescription(t.description)
          setStatus(t.status)
          setPriority(t.priority)
        })
        .finally(() => setLoading(false))
    }
  }, [taskId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    try {
      if (isEditing && task) {
        await updateTask.mutateAsync({
          id: task.id,
          data: { title, description, status, priority },
        })
        toast.success('Task updated')
      } else {
        await createTask.mutateAsync({ title, description, status, priority, projectId })
        toast.success('Task created')
      }
      onClose()
    } catch {
      toast.error(isEditing ? 'Failed to update task' : 'Failed to create task')
    }
  }

  async function handleDelete() {
    if (!task) return
    try {
      await deleteTask.mutateAsync(task.id)
      toast.success('Task deleted')
      onClose()
    } catch {
      toast.error('Failed to delete task')
    }
  }

  const isPending = createTask.isPending || updateTask.isPending || deleteTask.isPending

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          className={clsx(
            'fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
            'bg-surface-elevated w-full max-w-lg rounded-md border border-surface-border shadow-modal',
            'focus:outline-none'
          )}
        >
          {loading ? (
            <div className="p-8 flex items-center justify-center">
              <Spinner className="w-5 h-5 text-content-secondary" />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Title + description */}
              <div className="p-5 space-y-3">
                <input
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title"
                  required
                  className="w-full bg-transparent text-content-primary text-base font-medium placeholder:text-content-disabled focus:outline-none"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add description…"
                  rows={3}
                  className="w-full bg-transparent text-content-secondary text-sm placeholder:text-content-disabled resize-none focus:outline-none"
                />
              </div>

              {/* Metadata selectors */}
              <div className="px-5 pb-4 flex gap-2 flex-wrap border-t border-surface-border pt-4">
                {/* Status dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setStatusOpen((o) => !o)
                      setPriorityOpen(false)
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-surface-border bg-surface text-xs hover:bg-surface-overlay transition-colors"
                  >
                    <StatusBadge status={status} />
                    <span className="text-content-secondary">{STATUS_LABELS[status]}</span>
                  </button>
                  {statusOpen && (
                    <div className="absolute top-full left-0 mt-1 z-10 bg-surface-elevated border border-surface-border rounded shadow-dropdown py-1 min-w-36">
                      {STATUSES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setStatus(s)
                            setStatusOpen(false)
                          }}
                          className={clsx(
                            'w-full text-left flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-surface-border transition-colors',
                            status === s ? 'text-content-primary' : 'text-content-secondary'
                          )}
                        >
                          <StatusBadge status={s} />
                          {STATUS_LABELS[s]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Priority dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setPriorityOpen((o) => !o)
                      setStatusOpen(false)
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-surface-border bg-surface text-xs hover:bg-surface-overlay transition-colors"
                  >
                    <PriorityBadge priority={priority} />
                    <span className="text-content-secondary">{PRIORITY_LABELS[priority]}</span>
                  </button>
                  {priorityOpen && (
                    <div className="absolute top-full left-0 mt-1 z-10 bg-surface-elevated border border-surface-border rounded shadow-dropdown py-1 min-w-32">
                      {PRIORITIES.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => {
                            setPriority(p)
                            setPriorityOpen(false)
                          }}
                          className={clsx(
                            'w-full text-left flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-surface-border transition-colors',
                            priority === p ? 'text-content-primary' : 'text-content-secondary'
                          )}
                        >
                          <PriorityBadge priority={p} />
                          {PRIORITY_LABELS[p]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-surface-border">
                {isEditing && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={handleDelete}
                    loading={deleteTask.isPending}
                  >
                    Delete
                  </Button>
                )}
                <div className={clsx('flex gap-2', isEditing ? '' : 'ml-auto')}>
                  <Dialog.Close asChild>
                    <Button type="button" variant="ghost" size="sm">
                      Cancel
                    </Button>
                  </Dialog.Close>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    loading={isPending}
                    disabled={!title.trim()}
                  >
                    {isEditing ? 'Save' : 'Create task'}
                  </Button>
                </div>
              </div>
            </form>
          )}

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 text-content-disabled hover:text-content-secondary transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
