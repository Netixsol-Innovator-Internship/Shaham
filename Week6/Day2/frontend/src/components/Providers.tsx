"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { useEffect } from "react";
import { connectSocket, disconnectSocket, getSocket } from "@/lib/socket";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { addNotification } from "@/lib/notificationSlice";
import { updateLoyaltyPoints } from "@/lib/authSlice";
import { api } from "@/lib/api";

function SocketBridge({ children }: { children: React.ReactNode }) {
  const token = useSelector((s: RootState) => s.auth.token);
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const user = useSelector((s: RootState) => s.auth.user);

  useEffect(() => {
    // Connect/disconnect on auth changes
    if (isAuthenticated && token) {
      const socket = connectSocket({ userId: user?.id, admin: user?.role === 'admin' || user?.role === 'super_admin' });

      // Events
      const onNewNotification = (payload: any) => {
        store.dispatch(addNotification(payload));
      };
      const onSaleStarted = (payload: any) => {
        store.dispatch(addNotification(payload));
      };
      const onPointsUpdated = (payload: { userId: string; points: number }) => {
        store.dispatch(updateLoyaltyPoints(payload.points));
      };

      socket.on("notifications:new", onNewNotification);
      socket.on("sale:started", onSaleStarted);
      socket.on("loyalty:points_updated", onPointsUpdated);
      // Legacy notifications gateway event name
      socket.on("notification", onNewNotification);

      // Initial fetch: notifications and profile refresh
      store.dispatch(api.endpoints.getNotifications.initiate());
      store.dispatch(api.endpoints.getProfile.initiate());

      return () => {
        const s = getSocket();
        s.off("notifications:new", onNewNotification);
        s.off("sale:started", onSaleStarted);
        s.off("loyalty:points_updated", onPointsUpdated);
        s.off("notification", onNewNotification);
        disconnectSocket();
      };
    } else {
      disconnectSocket();
    }
  }, [isAuthenticated, token, user?.id, user?.role]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SocketBridge>{children}</SocketBridge>
    </Provider>
  );
}
