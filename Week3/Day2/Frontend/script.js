// Theme Toggle Functionality
const themeToggle = document.getElementById("theme-toggle")
const mobileThemeToggle = document.getElementById("mobile-theme-toggle")
const toggleDot = document.getElementById("toggle-dot")
const mobileToggleDot = document.getElementById("mobile-toggle-dot")
const html = document.documentElement

function toggleTheme() {
  html.classList.toggle("dark")
  const isDark = html.classList.contains("dark")
  localStorage.setItem("theme", isDark ? "dark" : "light")
}

// Initialize theme from localStorage
const savedTheme = localStorage.getItem("theme")
if (savedTheme === "light") {
  html.classList.remove("dark")
} else {
  html.classList.add("dark")
}
themeToggle.addEventListener("click", toggleTheme)
mobileThemeToggle.addEventListener("click", toggleTheme)

const mobileMenuBtn = document.getElementById("mobile-menu-btn")
const mobileMenu = document.getElementById("mobile-menu")
const mobileMenuClose = document.getElementById("mobile-menu-close")

function openMobileMenu() {
  mobileMenu.classList.remove("translate-x-full")
  document.body.style.overflow = "hidden"
}

function closeMobileMenu() {
  mobileMenu.classList.add("translate-x-full")
  document.body.style.overflow = "auto"
}

mobileMenuBtn.addEventListener("click", openMobileMenu)
mobileMenuClose.addEventListener("click", closeMobileMenu)

const mobileMenuLinks = mobileMenu.querySelectorAll("a")
mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu)
})

const socialIcons = document.querySelectorAll(".flex.items-center.justify-center.lg\\:justify-start a")
socialIcons.forEach((icon, index) => {
  icon.style.animationDelay = `${0.6 + index * 0.1}s`
  icon.classList.add("animate-slide-in-up")
})
