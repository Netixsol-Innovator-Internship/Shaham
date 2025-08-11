const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const serverUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : `http://localhost:${process.env.PORT || 5000}`;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '1.0.0',
      description: 'A simple in-memory CRUD Task Manager API'
    },
    servers: [
      {
        url: serverUrl,
        description: process.env.VERCEL_URL ? 'Production server' : 'Local server'
      }
    ]
  },
  // Look for JSDoc comments in controllers for endpoints and schemas
  apis: [path.join(process.cwd(), 'controllers/*.js')]
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
