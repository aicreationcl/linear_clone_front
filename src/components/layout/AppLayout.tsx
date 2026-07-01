import type { ReactNode } from 'react'
import Sidebar from '../sidebar/Sidebar'
import Toaster from '../ui/Toast'
import CommandPalette from '../CommandPalette'
import { useUIStore } from '../../stores/ui.store'
import { useGlobalHotkeys } from '../../hooks/useGlobalHotkeys'

interface Props {
  children: ReactNode
}

export default function AppLayout({ children }: Props) {
  const { isCommandPaletteOpen, closeCommandPalette } = useUIStore()

  useGlobalHotkeys()

  return (
    <div className="flex h-screen bg-surface overflow-hidden w-full">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col">{children}</main>
      <Toaster />
      <CommandPalette open={isCommandPaletteOpen} onClose={closeCommandPalette} />
    </div>
  )
}
