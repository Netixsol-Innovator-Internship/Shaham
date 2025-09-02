"use client"
import React, { useState, useRef, useEffect } from "react"
import { Bell } from "lucide-react"

interface Notification {
  _id: string
  type: 'Start' | 'New' | 'Win' | 'End' | string
  comment?: string
  car?: string
  read?: boolean
  createdAt?: string
}

interface NotificationBellDropdownProps {
  notifications: Notification[]
  onMarkRead?: (id: string) => void
}

const NotificationBellDropdown: React.FC<NotificationBellDropdownProps> = ({ notifications, onMarkRead }) => {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative p-2 rounded-full hover:bg-gray-100"
        onClick={() => setOpen((v) => !v)}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl z-40 border">
          <div className="p-4 border-b font-semibold text-gray-800">Notifications</div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-gray-500 text-center">No notifications</div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`px-4 py-3 border-b last:border-b-0 flex items-start gap-2 ${notif.read ? "bg-gray-50" : "bg-indigo-50"}`}
                >
                  <div className="flex-1">
                    <div className="text-sm text-gray-900 font-medium">
                      {notif.type === 'Start' && '🔔 Bid Start'}
                      {notif.type === 'New' && '🔔 New Bid'}
                      {notif.type === 'Win' && '🔔 Bid Winner'}
                      {notif.type === 'End' && '🔔 Bid Ended'}
                      {!['Start', 'New', 'Win', 'End'].includes(notif.type) && '🔔 Notification'}
                    </div>
                    {notif.comment && (
                      <div className="text-sm text-gray-800 mt-0.5">{notif.comment}</div>
                    )}
                    {notif.createdAt && (
                      <div className="text-xs text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</div>
                    )}
                  </div>
                  {!notif.read && onMarkRead && (
                    <button
                      className="text-xs text-indigo-600 hover:underline ml-2"
                      onClick={() => onMarkRead(notif._id)}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBellDropdown
