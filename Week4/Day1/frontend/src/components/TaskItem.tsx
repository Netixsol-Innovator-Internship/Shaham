"use client"

import type { Task } from "../types"
import { TaskAPI } from "../api"

interface Props {
  task: Task
  onUpdated(task: Task): void
  onDeleted(id: string): void
  setError(msg: string | null): void
}

export default function TaskItem({ task, onUpdated, onDeleted, setError }: Props) {
  async function toggle() {
    try {
      const updated = await TaskAPI.update(task.id, { completed: !task.completed })
      onUpdated(updated)
    } catch (e: any) {
      setError(e?.response?.data?.error ?? e.message ?? "Failed to update task")
    }
  }

  async function remove() {
    try {
      await TaskAPI.remove(task.id)
      onDeleted(task.id)
    } catch (e: any) {
      setError(e?.response?.data?.error ?? e.message ?? "Failed to delete task")
    }
  }

  return (
    <li className="group flex items-start gap-3 rounded-lg border border-transparent p-3 transition-colors hover:border-gray-200/50 hover:bg-gray-50/50 dark:hover:border-gray-700/50 dark:hover:bg-gray-800/30">
      <div className="flex-shrink-0 pt-0.5">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={toggle}
          className="checkbox"
          aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        />
      </div>
      <div className="min-w-0 flex-1">
        <span
          className={`block break-words text-sm leading-relaxed ${
            task.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-gray-100"
          }`}
        >
          {task.title}
        </span>
      </div>
      <div className="flex-shrink-0">
        <button
          onClick={remove}
          className="btn-ghost text-xs text-red-600 dark:text-red-400 border-red-200/30 dark:border-red-900/30 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1"
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>
    </li>
  )
}
