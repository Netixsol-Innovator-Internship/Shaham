import type { Task, UpdateTaskRequest } from "../types/task.ts"

class TaskStore {
  private tasks: Task[] = []
  private nextId = 1

  getAllTasks(): Task[] {
    return this.tasks
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks.find(task => task.id === id)
  }

  createTask(title: string): Task {
    const task: Task = {
      id: this.nextId.toString(),
      title,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    this.tasks.push(task)
    this.nextId++
    return task
  }

  updateTask(id: string, updates: UpdateTaskRequest): Task | null {
    const taskIndex = this.tasks.findIndex(task => task.id === id)
    
    if (taskIndex === -1) {
      return null
    }

    const updatedTask = {
      ...this.tasks[taskIndex],
      ...updates,
      updatedAt: new Date()
    }

    this.tasks[taskIndex] = updatedTask
    return updatedTask
  }

  deleteTask(id: string): boolean {
    const taskIndex = this.tasks.findIndex(task => task.id === id)
    
    if (taskIndex === -1) {
      return false
    }

    this.tasks.splice(taskIndex, 1)
    return true
  }

  getStats() {
    const total = this.tasks.length
    const completed = this.tasks.filter(task => task.completed).length
    const pending = total - completed

    return {
      total,
      completed,
      pending
    }
  }
}

export const taskStore = new TaskStore()