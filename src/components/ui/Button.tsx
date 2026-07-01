import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import clsx from 'clsx'
import Spinner from './Spinner'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: ReactNode
}

const VARIANT: Record<Variant, string> = {
  primary: 'bg-accent-violet hover:bg-accent-violet-hover text-white',
  secondary:
    'bg-surface-elevated hover:bg-surface-border text-content-primary border border-surface-border',
  ghost: 'text-content-secondary hover:text-content-primary hover:bg-surface-elevated',
  danger: 'text-red-400 hover:text-red-300 hover:bg-red-400/10',
}

const SIZE: Record<Size, string> = {
  sm: 'text-xs px-2.5 py-1.5',
  md: 'text-sm px-3 py-2',
}

export default function Button({
  variant = 'primary',
  size = 'sm',
  loading = false,
  disabled,
  children,
  className,
  ...props
}: Props) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-1.5 rounded font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet focus-visible:ring-offset-1 focus-visible:ring-offset-surface',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANT[variant],
        SIZE[size],
        className
      )}
      {...props}
    >
      {loading && <Spinner className="w-3.5 h-3.5" />}
      {children}
    </button>
  )
}
