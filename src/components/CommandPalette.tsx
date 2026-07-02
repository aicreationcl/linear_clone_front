import { Command } from 'cmdk'
import * as Dialog from '@radix-ui/react-dialog'
import { useNavigate } from 'react-router-dom'
import { useProjects } from '../hooks/useProjects'
import { useUIStore } from '../stores/ui.store'
import { FolderOpen, Plus, LayoutGrid, List, Search } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
}

export default function CommandPalette({ open, onClose }: Props) {
  const { data: projects = [] } = useProjects()
  const { openTaskModal, setViewMode } = useUIStore()
  const navigate = useNavigate()

  function runAction(fn: () => void) {
    fn()
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50 animate-fade-in"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
        />
        <Dialog.Content
          className="fixed top-[18%] left-1/2 -translate-x-1/2 z-50 w-full max-w-[520px] px-4 animate-scale-in"
          aria-label="Command palette"
        >
          <Command
            className="overflow-hidden rounded-xl"
            style={{
              background: 'linear-gradient(160deg, #1e1e26 0%, #18181e 100%)',
              border: '1px solid rgba(42,42,50,0.9)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 32px 64px rgba(0,0,0,0.7)',
            }}
          >
            {/* Search input */}
            <div
              className="flex items-center gap-2.5 px-4"
              style={{ borderBottom: '1px solid rgba(42,42,50,0.8)' }}
            >
              <Search className="w-4 h-4 text-content-disabled flex-shrink-0" />
              <Command.Input
                placeholder="Buscar proyectos y acciones…"
                className="flex-1 py-3.5 bg-transparent text-sm text-content-primary placeholder:text-content-disabled focus:outline-none"
              />
              <kbd
                className="text-[10px] text-content-disabled px-1.5 py-0.5 rounded border border-surface-border"
                style={{ fontFamily: 'var(--font-mono)', background: 'rgba(42,42,50,0.5)' }}
              >
                Esc
              </kbd>
            </div>

            {/* Results */}
            <Command.List className="max-h-72 overflow-y-auto scrollbar-thin p-1.5">
              <Command.Empty className="px-4 py-8 text-center text-content-secondary text-sm">
                Sin resultados.
              </Command.Empty>

              {projects.length > 0 && (
                <Command.Group
                  heading="Proyectos"
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:text-content-disabled [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.08em]"
                  style={{ '--font-mono': 'var(--font-mono)' } as React.CSSProperties}
                >
                  {projects.map((p) => (
                    <Command.Item
                      key={p.id}
                      value={p.name}
                      onSelect={() => runAction(() => navigate(`/projects/${p.id}`))}
                      className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-content-secondary rounded-md cursor-pointer outline-none select-none data-[selected=true]:bg-surface-elevated data-[selected=true]:text-content-primary transition-colors"
                    >
                      <span
                        className="w-2 h-2 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: p.color }}
                      />
                      <FolderOpen className="w-3.5 h-3.5 flex-shrink-0 text-content-disabled" />
                      <span className="flex-1 truncate">{p.name}</span>
                      <span
                        className="text-content-disabled text-[10px]"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {p.identifier}
                      </span>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              <Command.Group
                heading="Acciones"
                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:text-content-disabled [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.08em]"
              >
                <Command.Item
                  value="new task create"
                  onSelect={() => runAction(() => openTaskModal())}
                  className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-content-secondary rounded-md cursor-pointer outline-none select-none data-[selected=true]:bg-surface-elevated data-[selected=true]:text-content-primary transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="flex-1">Nueva tarea</span>
                  <kbd
                    className="text-[10px] text-content-disabled px-1.5 py-0.5 rounded border border-surface-border"
                    style={{ fontFamily: 'var(--font-mono)', background: 'rgba(42,42,50,0.5)' }}
                  >
                    C
                  </kbd>
                </Command.Item>
                <Command.Item
                  value="board view kanban"
                  onSelect={() => runAction(() => setViewMode('kanban'))}
                  className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-content-secondary rounded-md cursor-pointer outline-none select-none data-[selected=true]:bg-surface-elevated data-[selected=true]:text-content-primary transition-colors"
                >
                  <LayoutGrid className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="flex-1">Ver tablero</span>
                  <kbd
                    className="text-[10px] text-content-disabled px-1.5 py-0.5 rounded border border-surface-border"
                    style={{ fontFamily: 'var(--font-mono)', background: 'rgba(42,42,50,0.5)' }}
                  >
                    V K
                  </kbd>
                </Command.Item>
                <Command.Item
                  value="list view"
                  onSelect={() => runAction(() => setViewMode('list'))}
                  className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-content-secondary rounded-md cursor-pointer outline-none select-none data-[selected=true]:bg-surface-elevated data-[selected=true]:text-content-primary transition-colors"
                >
                  <List className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="flex-1">Ver lista</span>
                  <kbd
                    className="text-[10px] text-content-disabled px-1.5 py-0.5 rounded border border-surface-border"
                    style={{ fontFamily: 'var(--font-mono)', background: 'rgba(42,42,50,0.5)' }}
                  >
                    V L
                  </kbd>
                </Command.Item>
              </Command.Group>
            </Command.List>

            {/* Footer */}
            <div
              className="px-4 py-2 flex items-center gap-4"
              style={{ borderTop: '1px solid rgba(42,42,50,0.8)' }}
            >
              {(
                [
                  ['↑↓', 'navegar'],
                  ['↵', 'seleccionar'],
                ] as const
              ).map(([key, label]) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 text-content-disabled text-xs"
                >
                  <kbd
                    className="px-1.5 py-0.5 rounded border border-surface-border text-[10px]"
                    style={{ fontFamily: 'var(--font-mono)', background: 'rgba(42,42,50,0.5)' }}
                  >
                    {key}
                  </kbd>
                  {label}
                </span>
              ))}
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
