import axios from "axios"

const API_BASE_URL = "https://shahamweek3day3backend.vercel.app/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
})

const tokenManager = {
  getToken: () => localStorage.getItem("token"),
  setToken: (token) => localStorage.setItem("token", token),
  clearToken: () => localStorage.removeItem("token"),
  isTokenValid: () => {
    const token = localStorage.getItem("token")
    if (!token) return false
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      return payload.exp * 1000 > Date.now()
    } catch {
      return false
    }
  },
}

api.interceptors.request.use((config) => {
  const token = tokenManager.getToken()
  if (token && tokenManager.isTokenValid()) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) tokenManager.clearToken()
    return Promise.reject(err)
  },
)

export const authAPI = {
  login: async (data) => {
    try {
      console.log(" Attempting login to:", `${API_BASE_URL}/users/login`)
      console.log(" Sending login data:", data)
      const response = await api.post("/users/login", data)
      console.log(" Login successful:", response.data)
      return response
    } catch (error) {
      console.log(" Login error full:", error.message)
      console.log(" Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        code: error.code,
      })

      if (error.code === "ECONNREFUSED" || error.message === "Network Error") {
        throw new Error("Cannot connect to server. Make sure your backend is running on http://localhost:5000")
      }

      throw error
    }
  },

  register: async (data) => {
    try {
      console.log(" Attempting registration to:", `${API_BASE_URL}/users/register`)
      console.log(" Sending registration data:", data)
      const response = await api.post("/users/register", data)
      console.log(" Registration successful:", response.data)
      return response
    } catch (error) {
      console.log(" Registration error full:", error.message)
      console.log(" Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        code: error.code,
      })

      if (error.code === "ECONNREFUSED" || error.message === "Network Error") {
        throw new Error("Cannot connect to server. Make sure your backend is running on http://localhost:5000")
      }

      throw error
    }
  },

  logout: () => tokenManager.clearToken(),
}

export const tasksAPI = {
  getTasks: () => api.get("/tasks"),
  createTask: (task) => api.post("/tasks", task),
  updateTask: (id, task) => api.put(`/tasks/${id}`, task),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
}

export { tokenManager }
export default api