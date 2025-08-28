'use client';
import { useEffect, useState } from 'react';

export default function NotificationToast({
  notification,
  onClose,
}: {
  notification: any;
  onClose?: () => void;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  // try different possible fields for the username
  const actorName =
    notification.author?.username ||
    notification.user?.username ||
    notification.actor?.username ||
    notification.from?.username ||
    'Someone';

  return (
    <div className="fixed top-4 right-4 bg-white text-gray-900 px-4 py-3 rounded-xl shadow-lg border border-gray-200 animate-slide-in w-72">
      <div className="font-semibold text-sm">{actorName}</div>
      <div className="text-sm">{notification.message || notification.type}</div>
      <div className="text-xs text-gray-500 mt-1">
        {new Date(notification.createdAt).toLocaleTimeString()}
      </div>
    </div>
  );
}
