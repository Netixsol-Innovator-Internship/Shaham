'use client';

import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { useGetNotificationsQuery } from '@/store/api';

export default function NotificationBell() {
  const token = useAppSelector((s) => s.auth.token);
  if (!token) return null;

  const { data: list = [] } = useGetNotificationsQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  })

  const unread = list.reduce((acc, n) => acc + (n.read ? 0 : 1), 0);

  return (
    <Link
      href="/notifications"
      className="relative inline-flex items-center"
      aria-label="Notifications"
      prefetch={false}
    >
      <span className="text-sm">🔔</span>
      {unread > 0 && (
        <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded-full">
          {unread}
        </span>
      )}
    </Link>
  );
}
