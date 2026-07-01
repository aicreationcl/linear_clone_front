import { create } from 'zustand'
import type { FilterState } from '../types/ui.types'

interface FilterStoreState {
  filters: FilterState
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  clearFilters: () => void
}

const defaultFilters: FilterState = {
  status: null,
  priority: null,
  assigneeId: null,
}

export const useFilterStore = create<FilterStoreState>()((set) => ({
  filters: defaultFilters,
  setFilter: (key, value) => set((s) => ({ filters: { ...s.filters, [key]: value } })),
  clearFilters: () => set({ filters: defaultFilters }),
}))
