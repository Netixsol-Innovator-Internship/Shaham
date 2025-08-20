"use client"

import { useState, useEffect } from "react"
import { useStore } from "../stores/useStore"
import { Sun, Moon } from "lucide-react"

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useStore()
  const [localDarkMode, setLocalDarkMode] = useState(false)

  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true"
    setLocalDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const handleToggleDarkMode = () => {
    const newDarkMode = !localDarkMode
    setLocalDarkMode(newDarkMode)
    localStorage.setItem("darkMode", newDarkMode.toString())
    toggleDarkMode(newDarkMode)

    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <button
      onClick={handleToggleDarkMode}
      className="relative p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm border border-white/20"
      aria-label="Toggle dark mode"
    >
      <div className="relative w-6 h-6">
        <Sun
          size={24}
          className={`absolute inset-0 text-white transition-all duration-300 ${
            localDarkMode ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
          }`}
        />
        <Moon
          size={24}
          className={`absolute inset-0 text-white transition-all duration-300 ${
            localDarkMode ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
          }`}
        />
      </div>
    </button>
  )
}

export default ThemeToggle
