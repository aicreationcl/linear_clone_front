import { create } from 'zustand'
import type { ViewMode } from '../types/ui.types'
import type { TaskStatus } from '../types/api.types'

interface UIState {
  viewMode: ViewMode
  selectedTaskId: string | null
  defaultTaskStatus: TaskStatus | null
  isTaskModalOpen: boolean
  isCommandPaletteOpen: boolean
  setViewMode: (mode: ViewMode) => void
  openTaskModal: (taskId?: string, defaultStatus?: TaskStatus) => void
  closeTaskModal: () => void
  toggleCommandPalette: () => void
  closeCommandPalette: () => void
}

export const useUIStore = create<UIState>()((set) => ({
  viewMode: 'kanban',
  selectedTaskId: null,
  defaultTaskStatus: null,
  isTaskModalOpen: false,
  isCommandPaletteOpen: false,
  setViewMode: (mode) => set({ viewMode: mode }),
  openTaskModal: (taskId, defaultStatus) =>
    set({
      isTaskModalOpen: true,
      selectedTaskId: taskId ?? null,
      defaultTaskStatus: defaultStatus ?? null,
    }),
  closeTaskModal: () =>
    set({ isTaskModalOpen: false, selectedTaskId: null, defaultTaskStatus: null }),
  toggleCommandPalette: () => set((s) => ({ isCommandPaletteOpen: !s.isCommandPaletteOpen })),
  closeCommandPalette: () => set({ isCommandPaletteOpen: false }),
}))
