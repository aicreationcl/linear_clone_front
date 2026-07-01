import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { useToastStore, type ToastVariant } from '../../stores/toast.store'
import clsx from 'clsx'

const VARIANT_CONFIG: Record<
  ToastVariant,
  {
    icon: React.FC<{ className?: string }>
    stripe: string
    bg: string
    text: string
    border: string
  }
> = {
  success: {
    icon: CheckCircle,
    stripe: '#059669',
    bg: 'rgba(5, 150, 105, 0.08)',
    text: '#34d399',
    border: 'rgba(5, 150, 105, 0.2)',
  },
  error: {
    icon: XCircle,
    stripe: '#dc2626',
    bg: 'rgba(220, 38, 38, 0.08)',
    text: '#f87171',
    border: 'rgba(220, 38, 38, 0.2)',
  },
  info: {
    icon: Info,
    stripe: '#5e6ad2',
    bg: 'rgba(30, 30, 36, 0.95)',
    text: '#eaeaec',
    border: 'rgba(42,42,50,0.8)',
  },
}

export default function Toaster() {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((t) => {
        const cfg = VARIANT_CONFIG[t.variant]
        const Icon = cfg.icon
        return (
          <div
            key={t.id}
            className={clsx(
              'flex items-center gap-3 pr-4 pl-0 rounded-lg text-sm overflow-hidden min-w-60 max-w-xs'
            )}
            style={{
              animation: 'toast-in 0.2s cubic-bezier(0.16,1,0.3,1) both',
              background: cfg.bg,
              border: `1px solid ${cfg.border}`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)',
              color: cfg.text,
            }}
            role="alert"
          >
            {/* Left accent stripe */}
            <div className="w-1 self-stretch flex-shrink-0" style={{ background: cfg.stripe }} />
            <Icon className="w-4 h-4 flex-shrink-0 ml-3" />
            <p className="flex-1 py-3 text-xs font-medium">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="flex-shrink-0 opacity-50 hover:opacity-90 transition-opacity"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
