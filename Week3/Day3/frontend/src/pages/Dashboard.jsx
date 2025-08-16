"use client"

import { useState, useEffect, useCallback } from "react"
import { tasksAPI, tokenManager } from "../services/api"
import TaskForm from "../components/TaskForm"
import TaskList from "../components/TaskList"
import ThemeToggle from "../components/ThemeToggle"

const Dashboard = ({ onLogout }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const response = await tasksAPI.getTasks()
      const tasksData = response.data.data?.tasks || []
      setTasks(tasksData)
      setError("")
    } catch (err) {
      console.error("Error fetching tasks:", err)
      setError(err.response?.data?.message || "Failed to fetch tasks")
      setTasks([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!tokenManager.isTokenValid()) {
      alert("Session expired or unauthorized. Please login again.")
      onLogout()
      return
    }
    fetchTasks()
  }, [fetchTasks, onLogout])

  const handleTaskCreate = async (taskData) => {
    setLoading(true)
    try {
      await tasksAPI.createTask(taskData)
      await fetchTasks()
      setError("")
    } catch (err) {
      console.error("Create task failed:", err)
      setError(err.response?.data?.message || "Failed to create task")
    } finally {
      setLoading(false)
    }
  }

  const handleTaskUpdate = async (taskId, taskData) => {
    const oldTasks = [...tasks]
    setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, ...taskData } : t)))

    try {
      const response = await tasksAPI.updateTask(taskId, taskData)
      if (response.data?.data?.task) {
        setTasks((prev) => prev.map((t) => (t._id === taskId ? response.data.data.task : t)))
      }
    } catch (err) {
      console.error("Update failed, reverting:", err)
      setTasks(oldTasks)
      setError(err.response?.data?.message || "Failed to update task")
    }
  }

  const handleTaskDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return

    try {
      await tasksAPI.deleteTask(taskId)
      setTasks((prev) => prev.filter((t) => t._id !== taskId))
      setError("")
    } catch (err) {
      console.error("Delete failed:", err)
      setError(err.response?.data?.message || "Failed to delete task")
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Task Dashboard</h1>
        <div className="header-actions">
          <ThemeToggle />
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      <div className="dashboard-content">
        <TaskForm onTaskCreate={handleTaskCreate} loading={loading} />
        <TaskList tasks={tasks} onTaskUpdate={handleTaskUpdate} onTaskDelete={handleTaskDelete} loading={loading} />
      </div>
    </div>
  )
}

export default Dashboard
