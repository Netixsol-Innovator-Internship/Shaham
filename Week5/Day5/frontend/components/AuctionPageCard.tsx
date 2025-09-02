"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { useCountdown } from "@/hooks/useCountdown"
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from "@/lib/api"

type AuctionCar = {
  _id: string;
  make: string;
  model: string;
  photos: string[];
  startingBid: number;
  highestBid?: { userId: string; amount: number; bidId: string };
  totalBids: number;
  startTime?: string;
  endTime: string;
  description?: string;
};

export default function AuctionPageCard({ auction }: { auction: AuctionCar }) {
  const { status, days, hours, mins, secs } = useCountdown(
    auction.startTime,
    auction.endTime
  )
  const [addToWishlist] = useAddToWishlistMutation()
  const [removeFromWishlist] = useRemoveFromWishlistMutation()

  const [wishlisted, setWishlisted] = useState(false)

  const currentBid = auction.highestBid?.amount ?? auction.startingBid

  const handleWishlistToggle = async () => {
    try {
      if (!wishlisted) {
        await addToWishlist(auction._id).unwrap()
        setWishlisted(true)
      } else {
        await removeFromWishlist(auction._id).unwrap()
        setWishlisted(false)
      }
    } catch (err) {
      console.error("Wishlist update failed", err)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md flex overflow-hidden relative">
      {/* Wishlist button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 rounded-full p-2 bg-white shadow-md"
      >
        <Star
          size={20}
          className={wishlisted ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}
        />
      </button>

      {/* Car Image */}
      <div className="w-1/2">
        <img
          src={auction.photos?.[0] || "/abstract-geometric-shapes.png"}
          alt={`${auction.make} ${auction.model}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          {/* Title */}
          <h2 className="text-xl font-bold text-[#1b2a6b] mb-2">
            {auction.make} {auction.model}
          </h2>

          {/* Stars */}
          <div className="mb-3">
            <Image src="/five stars.png" alt="Stars" width={120} height={20} />
          </div>

          {/* Description */}
          <p className="text-gray-500 text-sm mb-4">
            {auction.description
              ? auction.description.slice(0, 120) + "..."
              : "No description available."}
            <Link href={`/auction/${auction._id}`} className="text-[#1b2a6b] font-medium">
              {" "}View Details
            </Link>
          </p>
        </div>

        {/* Info Row */}
        <div className="grid grid-cols-2 gap-6 mb-4">
          {/* Left Side - Bid */}
          <div>
            <div className="text-2xl font-bold text-[#1b2a6b]">
              ${currentBid.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Current Bid</div>
          </div>

          {/* Right Side - Bids & End Time */}
          <div className="text-right">
            <div className="text-lg font-semibold">{auction.totalBids}</div>
            <div className="text-sm text-gray-500">Total Bids</div>
            <div className="mt-2 text-sm text-gray-500">
              {new Date(auction.endTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              {new Date(auction.endTime).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-500">End Time</div>
          </div>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-2 mb-4">
          {status === "upcoming" && (
            <div className="text-sm text-gray-500 font-medium">Auction not started yet</div>
          )}
          {status === "ended" && (
            <div className="text-sm text-red-500 font-medium">Auction ended</div>
          )}
          {status === "running" && (
            <>
              <div className="px-2 py-1 border rounded text-sm font-medium">{days} Days</div>
              <div className="px-2 py-1 border rounded text-sm font-medium">{hours} Hours</div>
              <div className="px-2 py-1 border rounded text-sm font-medium">{mins} mins</div>
              <div className="px-2 py-1 border rounded text-sm font-medium">{secs} secs</div>
              <div className="text-sm text-gray-500">Time Left</div>
            </>
          )}
        </div>

        {/* Submit button */}
        <Link
          href={`/auction/${auction._id}`}
          className={`block text-center w-full border-2 py-2 rounded-md font-medium transition
            ${status === "running"
              ? "border-[#1b2a6b] text-[#1b2a6b] hover:bg-[#1b2a6b] hover:text-white"
              : "border-gray-400 text-gray-400 cursor-not-allowed pointer-events-none"}`}
        >
          Submit A Bid
        </Link>
      </div>
    </div>
  )
}
