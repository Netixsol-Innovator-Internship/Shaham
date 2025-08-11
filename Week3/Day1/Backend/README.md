# Task Manager API

A simple Node.js + Express REST API for managing tasks.
It includes Swagger API documentation, a modular file structure, and basic error handling.
http://localhost:3000/api/tasks

# API Endpoints
Available Routes
# Method	     Endpoint	     Description
   GET	            /	        Get all tasks
   GET	           /:id	      Get a single task
   POST	            /	      Create a new task
   PUT	           /:id	        Update a task
   DELETE          /:id	        Delete a task

# API Documentation (Swagger)
Once the server is running, open:
http://localhost:5000/api-docs
This will show interactive API documentation.

# Technologies Used
- Node.js – Server runtime
- Express.js – Web framework
- Swagger UI Express – API documentation
- Nodemon - Auto-reloading during development
- JavaScript (ES6) – Main language

# Example Task Object

{
  "id": 1,
  "title": "Complete homework",
  "description": "Math and Science assignments",
  "completed": false
}

# To Start

Run 'npm run dev' in terminal to start server.