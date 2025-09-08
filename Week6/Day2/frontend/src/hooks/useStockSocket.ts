"use client";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { connectSocket } from '@/lib/socket';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export function useStockSocket() {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = connectSocket();

    const handleStockUpdated = (data: any) => {
      console.log('Stock updated:', data);
      
      // Invalidate product queries to refresh stock data
      dispatch(api.util.invalidateTags(['Product']));
      
      // Show toast notification for out of stock items
      if (data.isOutOfStock) {
        toast.error(`⚠️ ${data.color} - Size ${data.size} is now out of stock!`, {
          duration: 4000,
          position: 'top-right',
        });
      }
    };

    const handleProductSoldOut = (data: any) => {
      console.log('Product sold out:', data);
      
      // Invalidate product and cart queries
      dispatch(api.util.invalidateTags(['Product', 'Cart']));
      
      // Show toast notification
      toast.error(`🚫 ${data.productName} is now sold out!`, {
        duration: 5000,
        position: 'top-right',
      });
    };

    // Listen for stock events
    socket.on('stock:updated', handleStockUpdated);
    socket.on('product:sold_out', handleProductSoldOut);

    // Cleanup listeners on unmount
    return () => {
      socket.off('stock:updated', handleStockUpdated);
      socket.off('product:sold_out', handleProductSoldOut);
    };
  }, [dispatch]);
}
