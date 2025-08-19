"use client"
import { Button } from "./ui/Button"
import { Checkbox } from "./ui/Checkbox"
import { Card } from "./ui/Card"
import { Trash2, Calendar } from "lucide-react"

interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  isLoading?: boolean
}

export function TaskItem({ task, onToggle, onDelete, isLoading }: TaskItemProps) {
  return (
    <Card className="p-5 flex items-center gap-4 hover:shadow-lg transition-all duration-200 group border-l-4 border-l-transparent hover:border-l-blue-500">
      <Checkbox checked={task.completed} onCheckedChange={() => onToggle(task.id)} disabled={isLoading} />

      <div className="flex-1 min-w-0">
        <span
          className={`block text-base transition-all duration-200 break-words overflow-hidden ${
            task.completed
              ? "line-through text-gray-500 dark:text-gray-400"
              : "text-gray-900 dark:text-gray-100"
          }`}
        >
          {task.title}
        </span>
        {task.completed && (
          <div className="flex items-center gap-1 mt-1 text-xs text-green-600 dark:text-green-400">
            <Calendar className="h-3 w-3" />
            <span>Completed</span>
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(task.id)}
        disabled={isLoading}
        className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all duration-200"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </Card>
  )
}
