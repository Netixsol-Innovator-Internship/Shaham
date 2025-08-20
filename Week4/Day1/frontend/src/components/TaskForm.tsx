"use client"

import type React from "react"

import { useState } from "react"
import { TaskAPI } from "../api"
import type { Task } from "../types"

interface Props {
  onCreated(task: Task): void
  setError(msg: string | null): void
}

export default function TaskForm({ onCreated, setError }: Props) {
  const [title, setTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) {
      setError("Task title is required")
      return
    }

    setIsSubmitting(true)
    try {
      const t = await TaskAPI.create({ title: trimmed })
      onCreated(t)
      setTitle("")
      setError(null)
    } catch (e: any) {
      setError(e?.response?.data?.error ?? e.message ?? "Failed to add task")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:gap-2">
      <div className="flex-1">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="input w-full"
          aria-label="New task title"
          disabled={isSubmitting}
        />
      </div>
      <button
        className="btn-primary flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        disabled={isSubmitting || !title.trim()}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Adding...
          </>
        ) : (
          "Add Task"
        )}
      </button>
    </form>
  )
}
