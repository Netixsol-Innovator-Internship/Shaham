"use client"

import { useState, useEffect } from "react"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import Dashboard from "./pages/Dashboard"
import { tokenManager } from "./services/api"
import { ThemeProvider } from "./context/ThemeContext"
import "./App.css"

function TaskManagerApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (tokenManager.isTokenValid()) {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const handleLoginSuccess = () => setIsAuthenticated(true)
  const handleSignupSuccess = () => setIsAuthenticated(true)

  const handleLogout = () => {
    tokenManager.clearToken()
    setIsAuthenticated(false)
  }

  const toggleAuthMode = () => setShowSignup(!showSignup)

  if (loading) return <div className="loading">Loading...</div>

  return (
    <ThemeProvider>
      <div className="App">
        {isAuthenticated ? (
          <Dashboard onLogout={handleLogout} />
        ) : showSignup ? (
          <SignupPage onSignupSuccess={handleSignupSuccess} onToggleAuth={toggleAuthMode} />
        ) : (
          <LoginPage onLoginSuccess={handleLoginSuccess} onToggleAuth={toggleAuthMode} />
        )}
      </div>
    </ThemeProvider>
  )
}

export default TaskManagerApp
