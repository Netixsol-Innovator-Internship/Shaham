const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const isVercel = !!process.env.VERCEL_URL;

const serverUrl = isVercel
  ? `https://${process.env.VERCEL_URL}/api`
  : `http://localhost:${process.env.PORT || 5000}/api`;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Swagger UI', //
      version: '1.0.0',
      description: 'A simple in-memory CRUD Task Manager API'
    },
    servers: [
      {
        url: serverUrl,
        description: isVercel ? 'Production server' : 'Local server'
      }
    ]
  },
  // Look for JSDoc comments in controllers for endpoints and schemas
  apis: [path.join(process.cwd(), 'controllers/*.js')]
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
