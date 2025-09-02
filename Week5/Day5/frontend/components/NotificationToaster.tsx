import React, { useEffect } from "react"

interface NotificationToasterProps {
  message: string
  show: boolean
  onClose: () => void
  duration?: number // ms
}

const NotificationToaster: React.FC<NotificationToasterProps> = ({ message, show, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration, onClose])

  if (!show) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
      {message}
    </div>
  )
}

export default NotificationToaster
