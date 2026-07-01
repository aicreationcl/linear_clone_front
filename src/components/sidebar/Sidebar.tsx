import { Link, useLocation } from 'react-router-dom'
import { useProjects } from '../../hooks/useProjects'
import { useAuthStore } from '../../stores/auth.store'
import Avatar from '../ui/Avatar'
import clsx from 'clsx'
import { LogOut, ChevronDown } from 'lucide-react'

export default function Sidebar() {
  const { data: projects = [] } = useProjects()
  const { user, logout } = useAuthStore()
  const location = useLocation()

  return (
    <aside
      className="w-56 flex-shrink-0 flex flex-col h-full relative"
      style={{
        background: 'linear-gradient(180deg, #141418 0%, #111115 100%)',
        borderRight: '1px solid rgba(42,42,50,0.7)',
      }}
    >
      {/* Workspace header */}
      <div className="px-3 py-2.5" style={{ borderBottom: '1px solid rgba(42,42,50,0.7)' }}>
        <button className="w-full flex items-center gap-2 px-1.5 py-1.5 rounded-md hover:bg-surface-elevated transition-colors group">
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #6370d8 0%, #4f5bc0 100%)',
              boxShadow: '0 0 8px rgba(94,106,210,0.25)',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path
                d="M6 16L11 6L16 16"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-content-primary font-medium text-sm truncate flex-1 text-left">
            {user?.name ?? 'Workspace'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-content-disabled opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 scrollbar-thin">
        <p
          className="text-content-disabled text-[10px] font-semibold uppercase tracking-[0.08em] px-2 py-1 mb-1"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Projects
        </p>

        {projects.length === 0 && (
          <p className="text-content-disabled text-xs px-2 py-1.5 italic">No projects yet</p>
        )}

        {projects.map((p) => {
          const isActive = location.pathname.startsWith(`/projects/${p.id}`)
          return (
            <Link
              key={p.id}
              to={`/projects/${p.id}`}
              className={clsx(
                'flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all duration-150 relative group',
                isActive
                  ? 'text-content-primary'
                  : 'text-content-secondary hover:text-content-primary'
              )}
              style={
                isActive
                  ? {
                      background: `linear-gradient(90deg, rgba(94,106,210,0.1) 0%, rgba(30,30,36,0.6) 100%)`,
                      boxShadow: `inset 2px 0 0 ${p.color}`,
                    }
                  : undefined
              }
            >
              {!isActive && (
                <span
                  className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(42,42,50,0.4)' }}
                />
              )}
              <span
                className={clsx(
                  'w-1.5 h-1.5 rounded-[2px] flex-shrink-0 transition-all',
                  isActive ? 'scale-110' : 'group-hover:scale-110'
                )}
                style={{ backgroundColor: p.color }}
              />
              <span className="truncate flex-1 relative">{p.name}</span>
              <span
                className="text-content-disabled text-[10px] font-medium relative"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {p.identifier}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="p-2" style={{ borderTop: '1px solid rgba(42,42,50,0.7)' }}>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-surface-elevated transition-colors group cursor-default">
          {user && <Avatar name={user.name} size="sm" />}
          <span className="text-content-secondary text-xs truncate flex-1">{user?.email}</span>
          <button
            onClick={logout}
            className="opacity-0 group-hover:opacity-100 text-content-disabled hover:text-content-secondary transition-all"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
