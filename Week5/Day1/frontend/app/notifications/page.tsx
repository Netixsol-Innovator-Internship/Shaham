'use client';
import { useGetNotificationsQuery, useMarkAllReadMutation } from '@/store/api';
import { useAppSelector } from '@/store/hooks';

export default function NotificationsPage() {
  const token = useAppSelector(s => s.auth.token);
  const { data: list = [] } = useGetNotificationsQuery(undefined, { skip: !token, refetchOnMountOrArgChange: true, refetchOnReconnect: true });
  const [markAllRead] = useMarkAllReadMutation();

  return (
    <main className="container py-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <button
          className="btn"
          onClick={async () => {
            await markAllRead().unwrap();
          }}
        >
          Mark all as read
        </button>
      </div>
      <div className="space-y-2">
        {list.length === 0 && (
          <div className="text-sm text-gray-500">No notifications yet.</div>
        )}
        {list.map((n: any) => {
          const actorName =
            n.author?.username ||
            n.user?.username ||
            n.actor?.username ||
            n.from?.username ||
            'Someone';
          return (
            <div
              key={n._id}
              className="card p-4 flex items-center justify-between"
            >
              <div>
                <div className="font-medium">{actorName}</div>
                <div className="text-sm text-gray-600">
                  {n.message || n.type}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
