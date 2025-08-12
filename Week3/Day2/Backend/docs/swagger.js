const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager API",
      version: "2.0.0",
      description:
        "A robust Task Manager API with JWT authentication, MongoDB persistence, and comprehensive CRUD operations",
      contact: {
        name: "API Support",
        email: "support@taskmanager.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: process.env.BASE_URL || "https://shahamweek3day2backend.vercel.app",
        description: "Development server",
      },
      {
        url: "https://api.taskmanager.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token in the format: Bearer <token>",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    path.join(__dirname, "../routes/*.js"),
    path.join(__dirname, "../controllers/*.js"),
  ],
};

let specs = {};
try {
  specs = swaggerJsdoc(options);
} catch (err) {
  console.error("Swagger generation failed:", err);
  specs = {};
}

module.exports = {
  specs,
  swaggerUi,
};
