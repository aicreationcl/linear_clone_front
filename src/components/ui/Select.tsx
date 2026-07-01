import * as RadixSelect from '@radix-ui/react-select'
import { ChevronDown, Check } from 'lucide-react'
import clsx from 'clsx'

export interface SelectOption {
  value: string
  label: string
}

interface Props {
  value: string
  onValueChange: (v: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
}

export default function Select({ value, onValueChange, options, placeholder, className }: Props) {
  return (
    <RadixSelect.Root value={value} onValueChange={onValueChange}>
      <RadixSelect.Trigger
        className={clsx(
          'inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded border border-surface-border',
          'bg-surface-elevated text-content-primary hover:border-content-disabled',
          'focus:outline-none focus:ring-1 focus:ring-accent-violet',
          'transition-colors cursor-pointer',
          className
        )}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon asChild>
          <ChevronDown className="w-3 h-3 text-content-disabled flex-shrink-0" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          className={clsx(
            'bg-surface-elevated border border-surface-border rounded-md shadow-dropdown',
            'z-50 overflow-hidden min-w-[120px]'
          )}
          position="popper"
          sideOffset={4}
        >
          <RadixSelect.Viewport className="p-1">
            {options.map((opt) => (
              <RadixSelect.Item
                key={opt.value}
                value={opt.value}
                className={clsx(
                  'flex items-center gap-2 pl-6 pr-3 py-1.5 text-xs rounded text-content-secondary',
                  'cursor-pointer outline-none select-none',
                  'data-[highlighted]:bg-surface-border data-[highlighted]:text-content-primary',
                  'transition-colors'
                )}
              >
                <RadixSelect.ItemIndicator className="absolute left-2">
                  <Check className="w-3 h-3 text-accent-violet" />
                </RadixSelect.ItemIndicator>
                <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}
