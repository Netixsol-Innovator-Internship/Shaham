"use client";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectSocket } from '@/lib/socket';
import { api } from '@/lib/api';
import { RootState } from '@/lib/store';
import toast from 'react-hot-toast';

export function useAdminSocket() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  useEffect(() => {
    if (!isAdmin) return;

    const socket = connectSocket({ 
      userId: user?.id, 
      admin: true 
    });

    const handleNewOrder = (orderData: any) => {
      console.log('New order received:', orderData);
      
      // Invalidate orders query to refresh admin dashboard
      dispatch(api.util.invalidateTags(['Order']));
      
      // Show toast notification
      toast.success(`💰 New Order: $${orderData.total} (${orderData.itemCount} items)`, {
        duration: 6000,
        position: 'top-right',
      });
    };

    const handleNewUserRegistered = (userData: any) => {
      console.log('New user registered:', userData);
      
      // Invalidate users query if it exists
      dispatch(api.util.invalidateTags(['User']));
      
      // Show toast notification
      toast.success(`👤 New User: ${userData.name} (${userData.email})`, {
        duration: 5000,
        position: 'top-right',
      });
    };

    const handleRevenueUpdate = (revenueData: any) => {
      console.log('Revenue update:', revenueData);
      
      // Invalidate order queries for analytics
      dispatch(api.util.invalidateTags(['Order']));
    };

    const handleStockUpdate = (stockData: any) => {
      console.log('Admin stock update:', stockData);
      
      // Invalidate product queries for admin dashboard
      dispatch(api.util.invalidateTags(['Product']));
      
      // Show low stock warning
      if (stockData.stock <= 5 && stockData.stock > 0) {
        toast(`⚠️ Low Stock: ${stockData.color} - Size ${stockData.size} (${stockData.stock} left)`, {
          duration: 4000,
          position: 'top-right',
          icon: '⚠️',
        });
      }
    };

    // Listen for admin events
    socket.on('admin:new_order', handleNewOrder);
    socket.on('admin:new_user_registered', handleNewUserRegistered);
    socket.on('admin:revenue_update', handleRevenueUpdate);
    socket.on('admin:stock_updated', handleStockUpdate);

    // Cleanup listeners on unmount
    return () => {
      socket.off('admin:new_order', handleNewOrder);
      socket.off('admin:new_user_registered', handleNewUserRegistered);
      socket.off('admin:revenue_update', handleRevenueUpdate);
      socket.off('admin:stock_updated', handleStockUpdate);
    };
  }, [dispatch, isAdmin, user?.id]);
}
