"use client"

import type React from "react"
import { useTasks } from "../hooks/useTasks"
import { AddTaskForm } from "./AddTaskForm"
import { TaskItem } from "./TaskItem"
import { TaskStats } from "./TaskStats"
import LoadingSpinner from "./LoadingSpinner"
import ErrorMessage from "./ErrorMessage"
import { ThemeToggle } from "./ThemeToggle"
import { CheckSquare, Sparkles } from "lucide-react"

const TodoApp: React.FC = () => {
  console.log("TodoApp component rendering")
  const { tasks, stats, loading, error, addTask, deleteTask, toggleTask } = useTasks()
  console.log("useTasks hook returned:", { tasks, stats, loading, error })

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
              <CheckSquare className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                Stay organized and productive
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Stats */}
        <div className="mb-8">
          <TaskStats tasks={tasks} />
        </div>

        {/* Add Task Form */}
        <div className="mb-8">
          <AddTaskForm onAddTask={addTask} />
        </div>

        {/* Error Message */}
        {error && <ErrorMessage message={error} />}

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 inline-block mb-4">
                <CheckSquare className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">No tasks yet</p>
              <p className="text-gray-500 dark:text-gray-500">Add your first task above to get started!</p>
            </div>
          ) : (
            tasks.map((task) => <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />)
          )}
        </div>
      </div>
    </div>
  )
}

export default TodoApp
