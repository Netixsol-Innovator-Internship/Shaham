"use client"
import { useEffect, useState } from "react"

export type AuctionStatus = "upcoming" | "running" | "ended"

export function useCountdown(startTime?: string, endTime?: string) {
  const [status, setStatus] = useState<AuctionStatus>("upcoming")
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    mins: "00",
    secs: "00",
  })

  useEffect(() => {
    if (!endTime) return

    const updateTime = () => {
      const now = Date.now()
      const start = startTime ? new Date(startTime).getTime() : null
      const end = new Date(endTime).getTime()

      if (start && now < start) {
        setStatus("upcoming")
        setTimeLeft({ days: "00", hours: "00", mins: "00", secs: "00" })
        return
      }

      if (now >= end) {
        setStatus("ended")
        setTimeLeft({ days: "00", hours: "00", mins: "00", secs: "00" })
        return
      }

      setStatus("running")
      const diff = end - now
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const mins = Math.floor((diff / (1000 * 60)) % 60)
      const secs = Math.floor((diff / 1000) % 60)

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        mins: String(mins).padStart(2, "0"),
        secs: String(secs).padStart(2, "0"),
      })
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [startTime, endTime])

  return { status, ...timeLeft }
}
