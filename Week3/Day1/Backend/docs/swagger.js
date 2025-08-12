const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

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
        url: 'http://localhost:5000',
        description: 'Local server'
      }
    ]
  },
  // Look for JSDoc comments in controllers for endpoints and schemas
  apis: [path.join(__dirname, '../controllers/*.js')]
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;