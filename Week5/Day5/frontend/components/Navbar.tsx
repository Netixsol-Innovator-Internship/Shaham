"use client"
import Link from "next/link"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { useRouter, usePathname } from "next/navigation"
import NotificationBellDropdown from "./NotificationBellDropdown"
import NotificationToaster from "./NotificationToaster"
import io from 'socket.io-client'
import { useListNotificationsQuery, useMarkNotificationMutation } from "@/lib/api"
import { useState, useEffect } from "react"


export default function Navbar() {
  const auth = useSelector((s: RootState) => s.auth)
  const router = useRouter()
  const pathname = usePathname()
  const isLandingPage = pathname === "/"
  // Notifications
  const { data: notifications = [], refetch } = useListNotificationsQuery(undefined, {
    skip: !auth.loggedIn,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  })
  const [markNotification] = useMarkNotificationMutation()
  // Toaster state
  const [toastMsg, setToastMsg] = useState("")
  const [showToast, setShowToast] = useState(false)
  // Mark notification as read and show toast
  const handleMarkRead = async (id: string) => {
    await markNotification(id)
    refetch()
    setToastMsg("Notification marked as read")
    setShowToast(true)
  }
  const handleToastClose = () => setShowToast(false)

  // Ensure notifications reload after a fresh login
  useEffect(() => {
    if (auth.loggedIn) {
      refetch()
    }
  }, [auth.loggedIn, refetch])

  // Realtime updates: listen for server-side notification events
  useEffect(() => {
    if (!auth.loggedIn) return
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000'
    const s = io(wsUrl, { transports: ['websocket'] })
    const onNotif = () => {
      refetch()
      setToastMsg('You have a new notification')
      setShowToast(true)
    }
    const onAuction = () => {
      // Also refresh auctions list in background via window event (pages can handle it)
      window.dispatchEvent(new CustomEvent('auctions:refresh'))
    }
    s.on('notificationsUpdated', onNotif)
    s.on('auctionStarted', onAuction)
    s.on('auctionEnded', onAuction)
    return () => {
      s.off('notificationsUpdated', onNotif)
      s.off('auctionStarted', onAuction)
      s.off('auctionEnded', onAuction)
      s.disconnect()
    }
  }, [auth.loggedIn, refetch])

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-colors duration-300 ${isLandingPage ? "bg-transparent" : "bg-[#f8f9ff] shadow-sm"
        }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Car Logo" className="w-34 h-8" />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={`font-medium pb-1 ${isLandingPage
              ? "text-white hover:text-gray-200 border-b-2 border-white"
              : "text-gray-700 hover:text-[#3f4b8b] border-b-2 border-[#3f4b8b]"
              }`}
          >
            Home
          </Link>
          {auth.loggedIn && (
            <>
              <Link
                href="/auctions"
                className={`font-medium ${isLandingPage
                  ? "text-white hover:text-gray-200"
                  : "text-gray-700 hover:text-[#3f4b8b]"
                  }`}
              >
                Car Auction
              </Link>
              <Link
                href="/sell"
                className={`font-medium ${isLandingPage
                  ? "text-white hover:text-gray-200"
                  : "text-gray-700 hover:text-[#3f4b8b]"
                  }`}
              >
                Sell Your Car
              </Link>
              <Link
                href="/about-us"
                className={`font-medium ${isLandingPage
                  ? "text-white hover:text-gray-200"
                  : "text-gray-700 hover:text-[#3f4b8b]"
                  }`}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className={`font-medium ${isLandingPage
                  ? "text-white hover:text-gray-200"
                  : "text-gray-700 hover:text-[#3f4b8b]"
                  }`}
              >
                Contact
              </Link>
            </>
          )}
        </div>

        {/* Right Side */}
        {!auth.loggedIn ? (
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className={`px-4 py-2 border rounded transition ${isLandingPage
                ? "border-white text-white hover:bg-white hover:text-[#3f4b8b]"
                : "border-[#3f4b8b] text-[#3f4b8b] hover:bg-[#3f4b8b] hover:text-white"
                }`}
            >
              Login
            </Link>
            <Link
              href="/register"
              className={`px-4 py-2 rounded transition ${isLandingPage
                ? "bg-white text-[#3f4b8b] hover:bg-gray-200"
                : "bg-[#3f4b8b] text-white hover:bg-[#2e3a6a]"
                }`}
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button
              className={`transition ${isLandingPage ? "text-white" : "text-gray-600 hover:text-[#3f4b8b]"
                }`}
              onClick={() => router.push("/profile")}
              aria-label="profile"
            >
              <img src="/person.png" alt="Profile" className="w-3 h-3" />
            </button>

            <button
              className={`transition ${isLandingPage ? "text-white" : "text-gray-600 hover:text-[#3f4b8b]"
                }`}
            >
              <img src="/star.png" alt="Star" className="w-5 h-5" />
            </button>

            {/* Notification Bell Dropdown */}
            <NotificationBellDropdown
              notifications={notifications}
              onMarkRead={handleMarkRead}
            />

            <button
              className={`flex items-center gap-1 transition ${isLandingPage ? "text-white" : "text-gray-600 hover:text-[#3f4b8b]"
                }`}
            >
              <img src="/car icon.png" alt="Car" className="w-4 h-4" />
              <span className="text-sm">▼</span>
            </button>
          </div>
        )}
      </nav>
      {/* Notification Toaster */}
      <NotificationToaster message={toastMsg} show={showToast} onClose={handleToastClose} />
    </header>
  )
}
