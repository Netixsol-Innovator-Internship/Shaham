import type { Task } from "../types"

export default function Stats({ tasks }: { tasks: Task[] }) {
  const completed = tasks.filter((t) => t.completed).length
  const total = tasks.length
  const pending = total - completed

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
      <div className="chip bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-semibold">{completed}</span>
      </div>
      <div className="chip bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-semibold">{pending}</span>
      </div>
      <div className="chip bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-semibold">{total}</span>
      </div>
    </div>
  )
}
