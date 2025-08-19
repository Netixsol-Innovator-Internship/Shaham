import { Router, type Request, type Response } from "express"
import { taskStore } from "../data/taskStore"
import type { CreateTaskRequest, UpdateTaskRequest } from "../types/task"

const router = Router()

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks with statistics
 *     description: Retrieve all tasks along with completion statistics
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Successfully retrieved all tasks
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TasksResponse'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", (req: Request, res: Response) => {
  try {
    const tasks = taskStore.getAllTasks()
    const stats = taskStore.getStats()
    res.json({ tasks, stats })
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve tasks" })
  }
})

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     description: Create a new task with the provided title
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskRequest'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/", (req: Request, res: Response) => {
  try {
    const { title }: CreateTaskRequest = req.body

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        error: "Task title is required and cannot be empty",
      })
    }

    const task = taskStore.createTask(title.trim())
    res.status(201).json(task)
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" })
  }
})

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     description: Update an existing task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskRequest'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates: UpdateTaskRequest = req.body

    if (updates.title !== undefined && updates.title.trim().length === 0) {
      return res.status(400).json({
        error: "Task title cannot be empty",
      })
    }

    const updatedTask = taskStore.updateTask(id, updates)

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" })
    }

    res.json(updatedTask)
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" })
  }
})

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Delete an existing task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const deleted = taskStore.deleteTask(id)

    if (!deleted) {
      return res.status(404).json({ error: "Task not found" })
    }

    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" })
  }
})

export default router