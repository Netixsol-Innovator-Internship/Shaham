import express from "express"
import cors from "cors"
import taskRoutes from "./src/routes/tasks"
import { specs, swaggerUi } from "./src/config/swagger"

const app = express()
const PORT = process.env.PORT || 5000

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)
app.use(express.json())

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))
app.use("/api/tasks", taskRoutes)
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

export default app

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Swagger docs at http://localhost:${PORT}/api-docs`)
  })
}
