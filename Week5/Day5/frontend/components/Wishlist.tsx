'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Star } from "lucide-react"
import { useMyWishlistQuery, useRemoveFromWishlistMutation, useGetCarQuery } from "@/lib/api"
import { useCountdown } from "@/hooks/useCountdown"

type WishlistCar = {
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
}

interface WishlistCarCardProps {
  car: WishlistCar
  onRemove: (id: string) => void
}


const WishlistCarCard = ({ car, onRemove }: WishlistCarCardProps) => {
  // Fetch latest car data from DB
  const { data: carData } = useGetCarQuery(car._id)
  const [removing, setRemoving] = useState(false)
  const [wishlisted, setWishlisted] = useState(true) // default true in wishlist
  // Use latest car data if available
  const displayCar = carData || car
  // Countdown logic: stop timer if auction ended
  const auctionEnded = displayCar.status === "ended"
  const { status: timerStatus, days, hours, mins, secs } = useCountdown(displayCar.startTime, displayCar.endTime)
  const displayTimerStatus = auctionEnded ? "ended" : timerStatus
  const displayDays = auctionEnded ? "00" : days
  const displayHours = auctionEnded ? "00" : hours
  const displayMins = auctionEnded ? "00" : mins
  const displaySecs = auctionEnded ? "00" : secs
  // Show correct currentBid/highestBid
  const currentBid = displayCar.highestBid?.amount ?? displayCar.currentBid ?? 0
  // Show correct winningBid value (only if auction ended)
  const winningBid = auctionEnded ? displayCar.highestBid?.amount ?? 0 : 0

  const handleToggle = async () => {
    setRemoving(true)
    await onRemove(car._id)
    setWishlisted(false)
    setRemoving(false)
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md relative flex flex-col w-[380px] border">
      {/* Wishlist Star */}
      <button
        onClick={handleToggle}
        disabled={removing}
        className="absolute top-3 right-3 rounded-full p-2 bg-white shadow-md z-10"
      >
        <Star
          size={24}
          className={wishlisted ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}
        />
      </button>

      {/* Car Image */}
      <div className="w-full h-56 bg-gray-100">
        <img
          src={displayCar.images?.[0] || displayCar.image || "/jaguar.png"}
          alt={`${displayCar.make} ${displayCar.model}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-xl text-gray-900 mb-4 text-center">
          {displayCar.make} {displayCar.model}
        </h3>

        {/* Prices */}
        <div className="flex justify-between mb-6">
          <div className="bg-indigo-50 px-6 py-3 rounded-lg text-center w-[48%]">
            <div className="text-2xl font-bold text-indigo-600">
              ${typeof winningBid === "number" ? winningBid.toLocaleString() : "0"}
            </div>
            <div className="text-sm text-gray-600">Winning Bid</div>
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
                {displayTimerStatus === "running" ? (
                  <>
                    {displayCar.totalBids || 0} <span className="text-gray-500">Total Bids</span>
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

        {/* Submit Bid Button or Sold/Auction Ended */}
        {auctionEnded ? (
          <button
            disabled
            className="mb-3 mt-auto w-full bg-gray-300 text-gray-600 py-3 rounded-xl font-medium cursor-not-allowed"
          >
            {winningBid > 0 ? "Sold" : "Auction Ended"}
          </button>
        ) : (
          <Link href={`/auction/${displayCar._id}`}>
            <button className="mb-3 mt-auto w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition">
              Submit Bid
            </button>
          </Link>
        )}
      </div>
    </div>
  )
}

// ---------------- Wishlist Page ----------------

const Wishlist = () => {
  const { data: wishlist, isLoading, refetch } = useMyWishlistQuery()
  const [removeFromWishlist] = useRemoveFromWishlistMutation()

  const handleRemove = async (id: string) => {
    await removeFromWishlist(id)
    refetch()
  }

  if (isLoading) return <div>Loading...</div>
  if (!wishlist?.length) return <div className="text-center mt-10">No cars in your wishlist</div>

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {wishlist.map((car: WishlistCar) => (
        <WishlistCarCard key={car._id} car={car} onRemove={handleRemove} />
      ))}
    </div>
  )
}

export default Wishlist
