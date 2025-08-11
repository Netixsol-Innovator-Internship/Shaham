const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../docs/swagger');
const taskRoutes = require('../routes/taskRoutes');
const errorHandler = require('../middleware/errorHandler');

const app = express();

// JSON parser
app.use(express.json());

// Mount routes
app.use('/api/tasks', taskRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 for unknown routes (consistent response format)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    message: 'Route not found'
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
