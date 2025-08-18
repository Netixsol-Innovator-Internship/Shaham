import type React from "react"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm ${className}`}
      {...props}
    />
  )
}
