import express from "express";
import cors from "cors";
import { z } from "zod";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

const tasks: Task[] = [];

const CreateTaskSchema = z.object({
  title: z.string().trim().min(1, "title is required"),
});

const UpdateTaskSchema = z.object({
  title: z.string().trim().min(1).optional(),
  completed: z.boolean().optional(),
});

const app = express();
app.use(express.json());

const allowlist = (process.env.ALLOWED_ORIGINS || "*")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowlist.includes("*") || allowlist.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, status: "healthy" });
});

app.get("/api/tasks", (_req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const parsed = CreateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const now = new Date().toISOString();
  const task: Task = {
    id: crypto.randomUUID(),
    title: parsed.data.title,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
  tasks.unshift(task);
  res.status(201).json(task);
});

app.put("/api/tasks/:id", (req, res) => {
  const id = req.params.id;
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: "Task not found" });

  const parsed = UpdateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const now = new Date().toISOString();
  tasks[idx] = { ...tasks[idx], ...parsed.data, updatedAt: now };
  res.json(tasks[idx]);
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = req.params.id;
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: "Task not found" });
  const [deleted] = tasks.splice(idx, 1);
  res.json(deleted);
});

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Export the Express app as a serverless function for Vercel
export default app;

// For local development, keep the server listening
if (require.main === module) {
  const port = process.env.PORT ? Number(process.env.PORT) : 4000;
  app.listen(port, () => {
    console.log(`Task API listening on :${port}`);
  });
}