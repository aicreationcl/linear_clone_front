import { useHotkeys } from 'react-hotkeys-hook'
import { useUIStore } from '../stores/ui.store'

export function useGlobalHotkeys() {
  const { isTaskModalOpen, openTaskModal, setViewMode, toggleCommandPalette } = useUIStore()

  useHotkeys(
    'c',
    () => {
      if (!isTaskModalOpen) openTaskModal()
    },
    { preventDefault: true },
    [isTaskModalOpen, openTaskModal]
  )

  useHotkeys(
    'mod+k',
    (e) => {
      e.preventDefault()
      toggleCommandPalette()
    },
    { preventDefault: true },
    [toggleCommandPalette]
  )

  useHotkeys('v+k', () => setViewMode('kanban'), {}, [setViewMode])
  useHotkeys('v+l', () => setViewMode('list'), {}, [setViewMode])
}
