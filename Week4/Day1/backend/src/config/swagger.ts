import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

const servers =
  process.env.NODE_ENV === "production"
    ? [
        {
          url: "https://shahamweek4day1backend.vercel.app",
          description: "Production server",
        },
      ]
    : [
        {
          url: "http://localhost:5000",
          description: "Local server",
        },
      ]

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      version: "1.0.0",
      description: "A simple task management API with CRUD operations",
    },
    servers,
    components: {
      schemas: {
        Task: {
          type: "object",
          required: ["id", "title", "completed", "createdAt", "updatedAt"],
          properties: {
            id: { type: "string", description: "The unique identifier", example: "1" },
            title: { type: "string", description: "Task title", example: "Complete docs" },
            completed: { type: "boolean", description: "Completion flag", example: false },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation date",
              example: "2024-01-15T10:30:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Update date",
              example: "2024-01-15T10:30:00.000Z",
            },
          },
        },
        CreateTaskRequest: {
          type: "object",
          required: ["title"],
          properties: {
            title: { type: "string", description: "Task title", example: "Complete docs" },
          },
        },
        UpdateTaskRequest: {
          type: "object",
          properties: {
            title: { type: "string", description: "Updated task title", example: "Update docs" },
            completed: { type: "boolean", description: "Completion flag", example: true },
          },
        },
        TaskStats: {
          type: "object",
          properties: {
            total: { type: "number", description: "Total tasks", example: 10 },
            completed: { type: "number", description: "Completed tasks", example: 3 },
            pending: { type: "number", description: "Pending tasks", example: 7 },
          },
        },
        TasksResponse: {
          type: "object",
          properties: {
            tasks: {
              type: "array",
              items: { $ref: "#/components/schemas/Task" },
            },
            stats: { $ref: "#/components/schemas/TaskStats" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            error: { type: "string", description: "Error message", example: "Task not found" },
          },
        },
      },
      responses: {
        BadRequest: {
          description: "Bad request",
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
          },
        },
        NotFound: {
          description: "Resource not found",
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
          },
        },
        InternalServerError: {
          description: "Internal server error",
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/routes/*.js"],
}

const specs = swaggerJsdoc(options)

export { specs, swaggerUi }