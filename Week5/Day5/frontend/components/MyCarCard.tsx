"use client"
import { useEffect } from "react"
import { useStartAuctionMutation, useEndAuctionMutation, useGetCarQuery } from "@/lib/api"
import { useCountdown } from "@/hooks/useCountdown"
import { io } from "socket.io-client"

type Auction = {
  _id: string
  make: string
  model: string
  image?: string
  totalBids?: number
  status: "draft" | "active" | "ended"
  startTime?: string
  endTime?: string
  highestBid?: { amount: number; userId: string; bidId: string }
}

interface MyCarCardProps {
  auction: Auction
}

const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5000"

const MyCarCard = ({ auction }: MyCarCardProps) => {
  // 🔹 fetch from DB
  const { data: car, refetch, isLoading, isFetching } = useGetCarQuery(auction._id, {
    skip: !auction._id,
  })

  const [startAuction, { isLoading: starting }] = useStartAuctionMutation()
  const [endAuction, { isLoading: ending }] = useEndAuctionMutation()

  // 🔹 socket listener
  useEffect(() => {
    if (!auction._id) return
    const s = io(wsUrl, { transports: ["websocket"] })
    s.emit("join", { auctionId: auction._id })

    s.on("newBid", () => refetch())
    s.on("auctionUpdated", () => refetch())

    return () => {
      s.emit("leave", { auctionId: auction._id })
      s.disconnect()
    }
  }, [auction._id, refetch])

  // 🔹 always call countdown hook (safe defaults if no car yet)
  const { status: timerStatus, days, hours, mins, secs } = useCountdown(
    car?.startTime || auction.startTime,
    car?.endTime || auction.endTime
  )

  if (isLoading || isFetching) {
    return <div className="p-6 text-center">Loading...</div>
  }
  if (!car) {
    return <div className="p-6 text-center text-red-500">No car data found</div>
  }

  const displayAuction = car
  const auctionEnded = displayAuction.status === "ended"
  const displayTimerStatus = auctionEnded ? "ended" : timerStatus

  // 🔹 actions
  const handleStart = async () => {
    await startAuction(displayAuction._id)
    refetch()
  }

  const handleEnd = async () => {
    await endAuction(displayAuction._id)
    refetch()
  }

  // 🔹 bids
  const highestAmount = displayAuction.highestBid?.amount ?? 0

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md relative flex flex-col w-[380px] border">
      {/* Car Image */}
      <div className="w-full h-56 bg-gray-100">
        <img
          src={displayAuction.image || "/abstract-geometric-shapes.png"}
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
              ${highestAmount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Winning Bid</div>
          </div>
          <div className="bg-red-50 px-6 py-3 rounded-lg text-center w-[48%]">
            <div className="text-2xl font-bold text-red-500">
              ${highestAmount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Current Bid</div>
          </div>
        </div>

        {/* Timer + Total Bids */}
        <div className="flex items-center justify-between text-sm text-gray-700 mb-6">
          {displayTimerStatus !== "ended" ? (
            <>
              <div className="flex gap-2">
                {[days, hours, mins, secs].map((t, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="bg-gray-100 px-2 py-1 rounded-md text-gray-900 font-semibold text-xs w-10 text-center">
                      {t}
                    </div>
                    <span className="text-[10px] mt-1">{["Days", "Hours", "Mins", "Secs"][i]}</span>
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

        {/* Buttons */}
        {displayAuction.status === "draft" && (
          <button
            onClick={handleStart}
            disabled={starting}
            className="mt-auto w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition disabled:bg-gray-300 disabled:text-gray-600"
          >
            {starting ? "Starting..." : "Start Bid"}
          </button>
        )}

        {displayAuction.status === "active" && (
          <button
            onClick={handleEnd}
            disabled={displayTimerStatus !== "running"}
            className="mt-auto w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:text-gray-600"
          >
            {ending ? "Ending..." : "End Bid"}
          </button>
        )}

        {displayAuction.status === "ended" && (
          <button
            disabled
            className="mt-auto w-full bg-gray-300 text-gray-600 py-3 rounded-xl font-medium cursor-not-allowed"
          >
            Sold
          </button>
        )}
      </div>
    </div>
  )
}

export default MyCarCard
