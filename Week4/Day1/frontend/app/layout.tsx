import type React from "react"
import type { Metadata } from "next"
import "../src/index.css"
import "./globals.css"

export const metadata: Metadata = {
  title: "TaskFlow - Beautiful Todo App",
  description: "Stay organized and productive with TaskFlow",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  )
}
