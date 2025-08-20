import type { Task } from "../types"
import TaskItem from "./TaskItem"

interface Props {
  tasks: Task[]
  onUpdated(task: Task): void
  onDeleted(id: string): void
  setError(msg: string | null): void
}

export default function TaskList({ tasks, onUpdated, onDeleted, setError }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800 mb-4">
          <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">No tasks yet</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">Add your first task above to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} onUpdated={onUpdated} onDeleted={onDeleted} setError={setError} />
      ))}
    </div>
  )
}
