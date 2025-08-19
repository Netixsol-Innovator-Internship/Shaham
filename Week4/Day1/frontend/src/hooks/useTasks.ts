"use client"

import { useState, useEffect } from "react"
import type { Task } from "../types/task"
import { taskApi } from "../services/api"

export interface TaskStats {
  total: number
  completed: number
  pending: number
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tasks")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // keep tasks in sync with localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  // Stats
  const stats: TaskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
  }

  // Fetch tasks from backend (optional)
  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const tasksFromApi = await taskApi.getTasks()
      setTasks(tasksFromApi)
    } catch (err: any) {
      setError(err.message || "Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const addTask = async (title: string) => {
    try {
      setLoading(true)
      const newTask = await taskApi.createTask({ title })
      setTasks((prev) => [...prev, newTask])
    } catch (err: any) {
      setError(err.message || "Failed to add task")
    } finally {
      setLoading(false)
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      setLoading(true)
      const updated = await taskApi.updateTask(id, updates)
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
    } catch (err: any) {
      setError(err.message || "Failed to update task")
    } finally {
      setLoading(false)
    }
  }

  const deleteTask = async (id: string) => {
    try {
      setLoading(true)
      await taskApi.deleteTask(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch (err: any) {
      setError(err.message || "Failed to delete task")
    } finally {
      setLoading(false)
    }
  }

  const toggleTask = (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (task) {
      updateTask(id, { completed: !task.completed })
    }
  }

  return { tasks, stats, loading, error, addTask, updateTask, deleteTask, toggleTask }
}
