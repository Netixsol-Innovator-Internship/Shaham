"use client";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { connectSocket } from '@/lib/socket';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export function useSaleSocket() {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = connectSocket();

    const handleSaleStarted = (sale: any) => {
      console.log('Sale started:', sale);
      
      // Invalidate current sale query to refresh the data
      dispatch(api.util.invalidateTags(['Sale']));
      
      // Show toast notification
      toast.success(`🎉 ${sale.title} is now live! ${sale.discountPercentage}% OFF`, {
        duration: 5000,
        position: 'top-center',
      });
    };

    const handleSaleEnded = (sale: any) => {
      console.log('Sale ended:', sale);
      
      // Invalidate current sale query to refresh the data
      dispatch(api.util.invalidateTags(['Sale']));
      
      // Show toast notification
      toast(`⏰ ${sale.title} has ended`, {
        duration: 4000,
        position: 'top-center',
      });
    };

    // Listen for sale events
    socket.on('sale:started', handleSaleStarted);
    socket.on('sale:ended', handleSaleEnded);

    // Cleanup listeners on unmount
    return () => {
      socket.off('sale:started', handleSaleStarted);
      socket.off('sale:ended', handleSaleEnded);
    };
  }, [dispatch]);
}
