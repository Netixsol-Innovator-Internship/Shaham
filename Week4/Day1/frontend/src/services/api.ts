import axios, { type AxiosResponse } from "axios"
import type { Task, CreateTaskRequest, UpdateTaskRequest } from "../types/task"
import { handleApiError } from "../utils/errorHandler"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export const taskApi = {
  // Get all tasks + stats
  getAllTasks: async (): Promise<{ tasks: Task[]; stats: any }> => {
    try {
      const response: AxiosResponse<{ tasks: Task[]; stats: any }> = await api.get("/api/tasks")
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Just tasks (shortcut)
  getTasks: async (): Promise<Task[]> => {
    try {
      const { tasks } = await taskApi.getAllTasks()
      return tasks
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Create a new task
  createTask: async (taskData: CreateTaskRequest): Promise<Task> => {
    try {
      console.log("[DEBUG] Sending taskData:", taskData)
      const response: AxiosResponse<Task> = await api.post("/api/tasks", taskData)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Update a task
  updateTask: async (id: string, taskData: UpdateTaskRequest): Promise<Task> => {
    try {
      const response: AxiosResponse<Task> = await api.put(`/api/tasks/${id}`, taskData)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Delete a task
  deleteTask: async (id: string): Promise<void> => {
    try {
      await api.delete(`/api/tasks/${id}`)
    } catch (error) {
      throw handleApiError(error)
    }
  },
}
