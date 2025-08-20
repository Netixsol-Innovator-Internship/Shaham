import axios from "axios";
import type { Task } from "./types";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000",
  headers: { "Content-Type": "application/json" },
});

export const TaskAPI = {
  async list(): Promise<Task[]> {
    const { data } = await api.get("/api/tasks");
    return data;
  },
  async create(payload: { title: string }): Promise<Task> {
    const { data } = await api.post("/api/tasks", payload);
    return data;
  },
  async update(id: string, payload: Partial<Pick<Task, 'title' | 'completed'>>): Promise<Task> {
    const { data } = await api.put(`/api/tasks/${id}`, payload);
    return data;
  },
  async remove(id: string): Promise<Task> {
    const { data } = await api.delete(`/api/tasks/${id}`);
    return data;
  },
  async health(): Promise<{ ok: boolean }> {
    const { data } = await api.get("/api/health");
    return data;
  }
}
