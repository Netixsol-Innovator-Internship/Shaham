"use client"
import { useState, useEffect } from "react"
import { tokenManager } from "../services/api"
import SignupForm from "../components/SignupForm"
import LoginForm from "../components/LoginForm"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLogin, setShowLogin] = useState(true)

  useEffect(() => {
    setIsAuthenticated(tokenManager.isTokenValid())
  }, [])

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    tokenManager.clearToken()
    setIsAuthenticated(false)
  }

  if (isAuthenticated) {
    return (
      <div className="container">
        <h1>Welcome! You are logged in.</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="auth-toggle">
        <button onClick={() => setShowLogin(true)} className={showLogin ? "active" : ""}>
          Login
        </button>
        <button onClick={() => setShowLogin(false)} className={!showLogin ? "active" : ""}>
          Sign Up
        </button>
      </div>

      {showLogin ? (
        <LoginForm onLoginSuccess={handleAuthSuccess} />
      ) : (
        <SignupForm onSignupSuccess={handleAuthSuccess} />
      )}
    </div>
  )
}
