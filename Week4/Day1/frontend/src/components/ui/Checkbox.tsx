"use client"

import { Check } from "lucide-react"

interface CheckboxProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

export function Checkbox({ checked, onCheckedChange, disabled }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      disabled={disabled}
      className={`
        relative h-5 w-5 rounded-lg border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
        ${
          checked
            ? "bg-gradient-to-r from-blue-600 to-purple-600 border-blue-600 text-white"
            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:border-blue-500 dark:hover:border-blue-400"
        }
      `}
    >
      {checked && <Check className="h-3 w-3 absolute top-0.5 left-0.5 text-white" strokeWidth={3} />}
    </button>
  )
}
