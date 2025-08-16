"use client"
import { useState } from "react"
import { authAPI, tokenManager } from "../services/api"

const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("[v0] Sending login data:", formData)
      const res = await authAPI.login(formData)
      console.log("[v0] Login response:", res.data)

      if (!res.data?.data?.token) throw new Error("No token received")
      tokenManager.setToken(res.data.data.token)
      onLoginSuccess()
    } catch (err) {
      console.error("[v0] Login error full:", err)
      console.error("[v0] Error details:", err.response?.data)

      let errorMessage = "Login failed"

      if (err.message === "Network Error" || err.code === "ECONNREFUSED") {
        errorMessage = "Cannot connect to server. Please make sure your backend is running on http://localhost:5000"
      } else if (err.response?.status === 401) {
        errorMessage = "Invalid email or password. Please check your credentials."
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || "Invalid request. Please check your input."
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.message) {
        errorMessage = err.message
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="form-input"
        />
      </div>
      {error && <div className="error">{error}</div>}
      <div className="form-group">
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </div>
    </form>
  )
}

export default LoginForm
