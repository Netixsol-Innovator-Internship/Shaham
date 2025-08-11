const tasks = require('../data/tasksData');

/**
 * NOTE: Swagger JSDoc comments used by swagger-jsdoc are included for each route
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Learn Express
 *         completed:
 *           type: boolean
 *           example: false
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     responses:
 *       200:
 *         description: Tasks fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 message:
 *                   type: string
 *                   example: Tasks fetched successfully
 */
exports.getAllTasks = (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: tasks,
      message: 'Tasks fetched successfully'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the task to get
 *     responses:
 *       200:
 *         description: Task fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *                 message:
 *                   type: string
 *                   example: Task fetched successfully
 *       404:
 *         description: Task not found
 */
exports.getTaskById = (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const task = tasks.find((t) => t.id === id);

    if (!task) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task,
      message: 'Task fetched successfully'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, completed]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Build API
 *               completed:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Validation error
 */
exports.createTask = (req, res, next) => {
  try {
    const { title, completed } = req.body;

    // Validation
    if (title === undefined || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'title is required and must be a non-empty string'
      });
    }
    if (completed === undefined || typeof completed !== 'boolean') {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'completed is required and must be a boolean'
      });
    }

    const newId = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
    const newTask = {
      id: newId,
      title: title.trim(),
      completed
    };

    tasks.push(newTask);

    res.status(201).json({
      success: true,
      data: newTask,
      message: 'Task created successfully'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated title
 *               completed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Task not found
 */
exports.updateTask = (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const task = tasks.find((t) => t.id === id);

    if (!task) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Task not found'
      });
    }

    const { title, completed } = req.body;

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'title must be a non-empty string when provided'
        });
      }
      task.title = title.trim();
    }

    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'completed must be a boolean when provided'
        });
      }
      task.completed = completed;
    }

    res.status(200).json({
      success: true,
      data: task,
      message: 'Task updated successfully'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
exports.deleteTask = (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const index = tasks.findIndex((t) => t.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Task not found'
      });
    }

    const deleted = tasks.splice(index, 1)[0];

    res.status(200).json({
      success: true,
      data: deleted,
      message: 'Task deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
