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
import toast from "react-hot-toast";

function SocketBridge({ children }: { children: React.ReactNode }) {
  const token = useSelector((s: RootState) => s.auth.token);
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const user = useSelector((s: RootState) => s.auth.user);

  useEffect(() => {
    // Connect socket regardless of auth status for sale events
    const socket = connectSocket({ 
      userId: isAuthenticated ? user?.id : null, 
      admin: user?.role === 'admin' || user?.role === 'super_admin' 
    });

    // Events
    const onNewNotification = (payload: any) => {
      if (isAuthenticated) {
        store.dispatch(addNotification(payload));
      }
    };
    
    const onSaleStarted = (payload: any) => {
      console.log('Sale started event received:', payload);
      // Invalidate sale queries for real-time updates
      store.dispatch(api.util.invalidateTags(['Sale']));
      if (isAuthenticated) {
        store.dispatch(addNotification(payload));
      }
      toast.success(`🎉 ${payload.title} is now live! ${payload.discountPercentage}% OFF`, {
        duration: 5000,
        position: 'top-center',
      });
    };
    
    const onSaleEnded = (payload: any) => {
      console.log('Sale ended event received:', payload);
      // Invalidate sale queries for real-time updates
      store.dispatch(api.util.invalidateTags(['Sale']));
      toast(`⏰ ${payload.title} has ended`, {
        duration: 4000,
        position: 'top-center',
      });
    };
    
    const onPointsUpdated = (payload: { userId: string; points: number }) => {
      if (isAuthenticated) {
        store.dispatch(updateLoyaltyPoints(payload.points));
      }
    };

    // Always listen for sale events
    socket.on("sale:started", onSaleStarted);
    socket.on("sale:ended", onSaleEnded);
    
    // Only listen for auth-specific events if authenticated
    if (isAuthenticated && token) {
      socket.on("notifications:new", onNewNotification);
      socket.on("loyalty:points_updated", onPointsUpdated);
      socket.on("notification", onNewNotification);

      // Initial fetch: notifications and profile refresh
      store.dispatch(api.endpoints.getNotifications.initiate());
      store.dispatch(api.endpoints.getProfile.initiate());
    }

    return () => {
      const s = getSocket();
      s.off("sale:started", onSaleStarted);
      s.off("sale:ended", onSaleEnded);
      if (isAuthenticated) {
        s.off("notifications:new", onNewNotification);
        s.off("loyalty:points_updated", onPointsUpdated);
        s.off("notification", onNewNotification);
      }
    };
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
