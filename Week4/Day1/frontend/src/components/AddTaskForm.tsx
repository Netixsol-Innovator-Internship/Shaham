"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { Card } from "./ui/Card"
import { Plus, Sparkles } from "lucide-react"

interface AddTaskFormProps {
  onAddTask: (title: string) => void
  isLoading?: boolean
}

export function AddTaskForm({ onAddTask, isLoading }: AddTaskFormProps) {
  const [title, setTitle] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError("Task title is required")
      return
    }

    onAddTask(title.trim())
    setTitle("")
    setError("")
  }

  return (
    <Card className="p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Add New Task</h2>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (error) setError("")
              }}
              className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
              disabled={isLoading}
            />
            {error && (
              <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {error}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isLoading || !title.trim()} className="px-6">
            <Plus className="h-4 w-4 mr-2" />
            {isLoading ? "Adding..." : "Add Task"}
          </Button>
        </div>
      </form>
    </Card>
  )
}
