import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="flex-1 min-h-screen flex items-center justify-center auth-bg p-4 relative overflow-hidden">
      {/* Decorative ambient orbs */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(94,106,210,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(94,106,210,0.04) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Auth card */}
      <div className="w-full max-w-sm animate-fade-up relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10 justify-center">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #6370d8 0%, #4f5bc0 100%)',
              boxShadow: '0 0 12px rgba(94,106,210,0.35), inset 0 1px 0 rgba(255,255,255,0.12)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path
                d="M6 16L11 6L16 16"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span
            className="text-content-primary font-semibold text-lg tracking-tight"
            style={{ fontFeatureSettings: '"cv02"' }}
          >
            Linear<span className="text-content-disabled font-normal"> Clone</span>
          </span>
        </div>

        {/* Form card */}
        <div
          className="p-6 rounded-xl"
          style={{
            background: 'linear-gradient(160deg, rgba(30,30,36,0.9) 0%, rgba(20,20,24,0.95) 100%)',
            border: '1px solid rgba(42,42,50,0.8)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.03), 0 32px 64px -16px rgba(0,0,0,0.7)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
