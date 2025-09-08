"use client";

import { useEffect, useState } from 'react';
import { X, Clock } from 'lucide-react';
import { useGetCurrentSaleQuery } from '@/lib/api';

export default function SaleNotificationBar() {
  const { data: currentSale, isLoading } = useGetCurrentSaleQuery();
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Reset visibility when a new sale starts - use a more stable key
  useEffect(() => {
    if (currentSale?._id) {
      setIsVisible(true);
    }
  }, [currentSale?._id]);

  // Handle sale end gracefully
  useEffect(() => {
    if (!currentSale) {
      setIsVisible(false);
    }
  }, [currentSale]);

  useEffect(() => {
    if (!currentSale || !currentSale.endAt) return;

    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(currentSale.endAt).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else if (minutes > 0) {
          setTimeLeft(`${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${seconds}s`);
        }
      } else {
        setTimeLeft('Sale Ended');
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [currentSale]);

  // Don't render if loading, no sale, or user dismissed
  if (isLoading || !currentSale || !isVisible) {
    return null;
  }

  return (
    <div className="bg-red-600 text-white py-3 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <span className="bg-white text-red-600 px-2 py-1 rounded-full text-xs font-bold">
              {currentSale.discountPercentage}% OFF
            </span>
            <span className="font-semibold text-lg">
              {currentSale.title}
            </span>
          </div>
          
          {currentSale.description && (
            <span className="hidden sm:inline text-red-100">
              {currentSale.description}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-red-700 px-3 py-1 rounded-full">
            <Clock className="w-4 h-4" />
            <span className="font-medium text-sm">
              Ends in: {timeLeft}
            </span>
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="text-red-200 hover:text-white transition-colors"
            aria-label="Close sale notification"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
