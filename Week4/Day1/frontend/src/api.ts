import axios from "axios";

// Add this type definition to fix the ImportMeta.env error
interface ImportMetaEnv {
  VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}

// Base URL is configured via VITE_API_BASE_URL
// e.g. http://localhost:4000 or https://your-backend.onrender.com
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000",
  headers: { "Content-Type": "application/json" }
});

export const TaskAPI = {
  async list() {
    const { data } = await api.get("/api/tasks");
    return data;
  },
  async create(payload: { title: string }) {
    const { data } = await api.post("/api/tasks", payload);
    return data;
  },
  async update(id: string, payload: Partial<{ title: string; completed: boolean }>) {
    const { data } = await api.put(`/api/tasks/${id}`, payload);
    return data;
  },
  async remove(id: string) {
    const { data } = await api.delete(`/api/tasks/${id}`);
    return data;
  },
};
