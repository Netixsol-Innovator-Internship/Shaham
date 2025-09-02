'use client'
import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { useCountdown } from "@/hooks/useCountdown"
import { useAddToWishlistMutation, useRemoveFromWishlistMutation, useGetCarQuery } from "@/lib/api"
import { io } from "socket.io-client"

type Auction = {
  _id: string
  make: string
  model: string
  image?: string
  winningBid?: number
  currentBid?: number
  totalBids?: number
  status: "draft" | "active" | "ended"
  startTime?: string
  endTime?: string
  userBid?: number
  isWishlisted?: boolean
}

import { useMyBidsQuery, useMyWishlistQuery } from "@/lib/api"

interface MyBidsCardProps {
  auction: Auction
  userBid: number
}

const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000'

const MyBidsCard = ({ auction, userBid }: MyBidsCardProps) => {
  // Fetch latest auction data from DB
  const { data: car, refetch } = useGetCarQuery(auction._id)
  const [addToWishlist] = useAddToWishlistMutation()
  const [removeFromWishlist] = useRemoveFromWishlistMutation()
  const { data: wishlist } = useMyWishlistQuery()

  // Countdown logic: stop timer if auction ended
  const auctionEnded = (car?.status || auction.status) === "ended"
  const { status: timerStatus, days, hours, mins, secs } = useCountdown(
    car?.startTime || auction.startTime,
    car?.endTime || auction.endTime
  )
  const displayTimerStatus = auctionEnded ? "ended" : timerStatus
  const displayDays = auctionEnded ? "00" : days
  const displayHours = auctionEnded ? "00" : hours
  const displayMins = auctionEnded ? "00" : mins
  const displaySecs = auctionEnded ? "00" : secs

  // Real-time updates: listen for newBid events
  useEffect(() => {
    const s = io(wsUrl, { transports: ['websocket'] })
    s.emit('join', { auctionId: auction._id })
    s.on('newBid', () => refetch())
    return () => {
      s.emit('leave', { auctionId: auction._id })
      s.disconnect()
    }
  }, [auction._id, refetch])


  // Wishlist star logic: yellow if in global wishlist
  const wishlisted = wishlist?.some((item: any) => item._id === auction._id) || false
  const handleWishlistToggle = async () => {
    try {
      if (!wishlisted) {
        await addToWishlist(auction._id).unwrap()
        refetch()
      } else {
        await removeFromWishlist(auction._id).unwrap()
        refetch()
      }
    } catch (err) {
      console.error('Wishlist update failed', err)
    }
  }

  // Use latest car data if available
  const displayAuction = car || auction
  // Show correct currentBid/highestBid
  const currentBid = displayAuction.highestBid?.amount ?? displayAuction.currentBid ?? 0

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md relative flex flex-col w-[380px] border">
      {/* Wishlist Star */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 rounded-full p-2 bg-white shadow-md z-10"
      >
        <Star
          size={20}
          className={wishlisted ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}
        />
      </button>

      {/* Car Image */}
      <div className="w-full h-56 bg-gray-100">
        <img
          src={displayAuction.image || "/bently.png"}
          alt={`${displayAuction.make} ${displayAuction.model}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-xl text-gray-900 mb-4 text-center">
          {displayAuction.make} {displayAuction.model}
        </h3>

        {/* Prices */}
        <div className="flex justify-between mb-6">
          <div className="bg-indigo-50 px-6 py-3 rounded-lg text-center w-[48%]">
            <div className="text-2xl font-bold text-indigo-600">
              ${typeof userBid === "number" ? userBid.toLocaleString() : "0"}
            </div>
            <div className="text-sm text-gray-600">Your Bid</div>
          </div>
          <div className="bg-red-50 px-6 py-3 rounded-lg text-center w-[48%]">
            <div className="text-2xl font-bold text-red-500">
              ${typeof currentBid === "number" ? currentBid.toLocaleString() : "0"}
            </div>
            <div className="text-sm text-gray-600">Current Bid</div>
          </div>
        </div>

        {/* Timer + Total Bids */}
        <div className="flex items-center justify-between text-sm text-gray-700 mb-6">
          {displayTimerStatus !== "ended" ? (
              <>
                <div className="flex gap-2">
                  {[displayDays, displayHours, displayMins, displaySecs].map((t, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="bg-gray-100 px-2 py-1 rounded-md text-gray-900 font-semibold text-xs w-10 text-center">
                        {t}
                      </div>
                      <span className="text-[10px] mt-1">
                        {["Days", "Hours", "Mins", "Secs"][i]}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-right font-medium">
                  {displayAuction.status === "active" && displayTimerStatus === "running" ? (
                    <>
                      {displayAuction.totalBids || 0} <span className="text-gray-500">Total Bids</span>
                    </>
                  ) : (
                    <span className="text-gray-500">Starts Soon</span>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 w-full">Auction Ended</div>
            )}
        </div>

        {/* Status Buttons */}
        {displayAuction.status === "active" && timerStatus === "running" && (
          <button className="mt-auto w-full bg-indigo-600 text-white py-3 rounded-xl font-medium bg-indigo-700 transition">
            Place Higher Bid
          </button>
        )}

        {displayAuction.status === "ended" && (
          <button
            disabled
            className="mt-auto w-full bg-gray-300 text-gray-600 py-3 rounded-xl font-medium cursor-not-allowed"
          >
            {displayAuction.winningBid === displayAuction.userBid ? "You Won!" : "Auction Ended"}
          </button>
        )}
      </div>
    </div>
  )
}

export default MyBidsCard
