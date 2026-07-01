import clsx from 'clsx'

interface Props {
  name: string
  size?: 'sm' | 'md'
  className?: string
}

const SIZE: Record<'sm' | 'md', string> = {
  sm: 'w-5 h-5 text-[10px]',
  md: 'w-6 h-6 text-xs',
}

export default function Avatar({ name, size = 'sm', className }: Props) {
  return (
    <span
      className={clsx(
        'rounded-full bg-accent-violet/20 text-accent-violet flex items-center justify-center font-medium flex-shrink-0',
        SIZE[size],
        className
      )}
      title={name}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  )
}
