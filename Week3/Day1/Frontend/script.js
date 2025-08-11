document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu-btn")
  const menuIcon = document.getElementById("menu-icon")
  const mobileMenu = document.getElementById("mobile-menu")
  const themeToggle = document.getElementById("theme-toggle")
  const mobileThemeToggle = document.getElementById("mobile-theme-toggle")

  // Mobile menu functionality
  if (menuBtn && menuIcon && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("menu-open")

      menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false")

      if (isOpen) {
        menuIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>`
      } else {
        menuIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>`
      }
    })
  }

  // Theme toggle functionality
  function toggleTheme() {
    const html = document.documentElement
    const isDark = html.classList.contains("dark")

    console.log("Toggle clicked! Current theme:", isDark ? "dark" : "light")

    if (isDark) {
      html.classList.remove("dark")
      localStorage.setItem("theme", "light")
      console.log("Switched to light mode")
    } else {
      html.classList.add("dark")
      localStorage.setItem("theme", "dark")
      console.log("Switched to dark mode")
    }
  }

  // Initialize theme on page load
  function initTheme() {
    const savedTheme = localStorage.getItem("theme")
    const html = document.documentElement

    // Default to light mode unless explicitly set to dark
    if (savedTheme === "dark") {
      html.classList.add("dark")
      console.log("Initialized with dark theme")
    } else {
      html.classList.remove("dark")
      // Set light as default if no preference is saved
      if (!savedTheme) {
        localStorage.setItem("theme", "light")
      }
      console.log("Initialized with light theme")
    }
  }

  // Event listeners for theme toggles
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme)
    console.log("Desktop theme toggle listener added")
  }

  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener("click", toggleTheme)
    console.log("Mobile theme toggle listener added")
  }

  // Initialize theme when page loads
  initTheme()

  // Listen for system theme changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      if (e.matches) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  })
})
