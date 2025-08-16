"use client"
import { useState } from "react"
import { authAPI, tokenManager } from "../services/api"

const SignupForm = ({ onSignupSuccess }) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters"
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter"
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter"
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number"
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      setError(passwordError)
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }

      console.log("[v0] Sending registration data:", registrationData)
      const res = await authAPI.register(registrationData)
      console.log("[v0] Registration response:", res.data)

      if (!res.data?.data?.token) throw new Error("No token received")
      tokenManager.setToken(res.data.data.token)
      onSignupSuccess()
    } catch (err) {
      console.error("[v0] Signup error full:", err)
      console.error("[v0] Error response:", err.response?.data)

      let errorMessage = "Registration failed"

      if (err.message === "Network Error" || err.code === "ECONNREFUSED") {
        errorMessage = "Cannot connect to server. Please make sure your backend is running on http://localhost:5000"
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
        if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
          const errorDetails = err.response.data.errors.map((error) => error.message).join(", ")
          errorMessage = `${errorMessage}: ${errorDetails}`
        }
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
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="form-input"
        />
      </div>
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
          placeholder="Password (min 6 chars, uppercase, lowercase, number)"
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <input
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          required
          className="form-input"
        />
      </div>
      <div className="password-requirements">
        Password must contain: uppercase letter, lowercase letter, and number (min 6 characters)
      </div>
      {error && <div className="error">{error}</div>}
      <div className="form-group">
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </div>
    </form>
  )
}

export default SignupForm
