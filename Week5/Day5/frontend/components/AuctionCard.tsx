"use client"
import Link from "next/link"
import { useCountdown } from "@/hooks/useCountdown"

type Auction = {
  _id: string
  make: string
  model: string
  startingBid: number
  minBid?: number
  endTime?: string
  startTime?: string
  highestBid?: { amount: number }
  status?: "draft" | "active" | "ended" | "completed"
}

export default function AuctionCard({ auction }: { auction: Auction }) {
  const { status, days, hours, mins, secs } = useCountdown(
    auction.startTime,
    auction.endTime
  )

  const currentBid =
    auction.highestBid?.amount ?? auction.startingBid ?? auction.minBid ?? 0

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md relative flex flex-col">
      {/* Image */}
      <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
        <img
          src={`/abstract-geometric-shapes.png?height=160&width=260&query=${auction.make || "luxury"} ${auction.model || "car"} auction`}
          alt={`${auction.make} ${auction.model}`}
          className="h-full object-contain"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-lg text-gray-800 mb-4 text-center">
          {auction.make || "Car"} {auction.model || "Model"}
        </h3>

        <div className="flex justify-between items-center mb-6">
          {/* Price */}
          <div>
            <div className="text-2xl font-bold text-[#3f4b8b]">
              ${currentBid}
            </div>
            <div className="text-sm text-gray-500">
              {auction.highestBid ? "Current Bid" : "Starting Bid"}
            </div>
          </div>

          {/* Countdown */}
          <div className="text-right">
            <div className="font-bold">
              {status === "running"
                ? `${days}d : ${hours}h : ${mins}m : ${secs}s`
                : status === "upcoming"
                ? "Not Started"
                : "Ended"}
            </div>
            <div className="text-sm text-gray-500">
              {status === "upcoming"
                ? "Waiting to Start"
                : status === "running"
                ? "Time Left"
                : "Auction Ended"}
            </div>
          </div>
        </div>

        {/* Submit button */}
        {status === "ended" ? (
          <button
            disabled
            className="mt-auto w-full bg-gray-400 text-white py-3 text-center font-medium rounded-none cursor-not-allowed"
          >
            Auction Ended
          </button>
        ) : (
          <Link
            href={`/auction/${auction._id}`}
            className="mt-auto w-full bg-[#3f4b8b] text-white py-3 text-center font-medium hover:bg-[#2f3a7b] transition rounded-none"
          >
            Submit A Bid
          </Link>
        )}
      </div>
    </div>
  )
}
