
'use client';
import { useEffect, useRef, useState } from 'react';
import { useGetNotificationsQuery } from '@/store/api';
import NotificationToast from './NotificationToast';
import { useAppSelector } from '@/store/hooks';

export default function NotificationProvider() {
  const token = useAppSelector((s) => s.auth.token);
  const { data: list = [] } = useGetNotificationsQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  const [queue, setQueue] = useState<any[]>([]);
  const seenIds = useRef<Set<string>>(new Set());

  // Clear any queued toasts when logging out
  useEffect(() => {
    if (!token) {
      setQueue([]);
      seenIds.current.clear();
    }
  }, [token]);

  // Enqueue only truly new notifications (not seen before)
  useEffect(() => {
    if (!list || list.length === 0) return;
    const next = [...queue];
    for (const n of list) {
      const id = String(n._id);
      if (!seenIds.current.has(id)) {
        seenIds.current.add(id);
        if (!n.read) next.push(n);
      }
    }
    if (next.length !== queue.length) setQueue(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  const handleClose = (id: string) => {
    setQueue((prev) => prev.filter((n) => String(n._id) !== id));
  };

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {queue.map((n) => (
        <NotificationToast
          key={String(n._id)}
          notification={n}
          onClose={() => handleClose(String(n._id))}
        />
      ))}
    </div>
  );
}
