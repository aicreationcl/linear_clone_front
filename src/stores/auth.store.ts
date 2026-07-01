import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UIUser } from '../types/ui.types'

interface AuthState {
  user: UIUser | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: UIUser, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'linear-auth' }
  )
)
