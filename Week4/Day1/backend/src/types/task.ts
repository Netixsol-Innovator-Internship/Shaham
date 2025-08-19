export interface CreateTaskRequest {
  title: string
}

export interface UpdateTaskRequest {
  title?: string
  completed?: boolean
}

export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

export interface TaskStats {
  total: number
  completed: number
  pending: number
}