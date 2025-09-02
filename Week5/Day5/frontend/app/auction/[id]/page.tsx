'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import io from 'socket.io-client'
import {
  useGetCarQuery,
  useListBidsQuery,
  usePlaceBidMutation,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation
} from '@/lib/api'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import Image from 'next/image'
import { Star } from 'lucide-react'

// WebSocket URL
const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000'

// Countdown hook
function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState<string>('')

  useEffect(() => {
    if (!targetDate) return
    const end = new Date(targetDate).getTime()

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = end - now

      if (distance <= 0) {
        clearInterval(interval)
        setTimeLeft('Auction Ended')
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const secs = Math.floor((distance % (1000 * 60)) / 1000)
        setTimeLeft(`${days}d ${hours}h ${mins}m ${secs}s`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return timeLeft
}

export default function AuctionDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: car } = useGetCarQuery(id)
  const { data: bids = [], refetch } = useListBidsQuery(id)
  const [amount, setAmount] = useState<number>(0)
  const [placeBid] = usePlaceBidMutation()
  const [addToWishlist] = useAddToWishlistMutation()
  const [removeFromWishlist] = useRemoveFromWishlistMutation()
  const auth = useSelector((s: RootState) => s.auth)
  const router = useRouter()
  const [activeImage, setActiveImage] = useState<string | null>(null)
  const [wishlisted, setWishlisted] = useState(false)

  // Countdown
  const countdown = useCountdown(car?.endTime)

  useEffect(() => {
    const s = io(wsUrl, { transports: ['websocket'] })
    s.emit('join', { auctionId: id })
    s.on('newBid', () => refetch())
    s.on('bidWinner', (payload: any) => {
      if (payload?.userId === auth.user?._id && payload?.carId === id) {
        router.push(`/payment/${id}`)
      }
    })
    return () => {
      s.emit('leave', { auctionId: id })
      s.disconnect()
    }
  }, [id])

  useEffect(() => {
    if (car) {
      setAmount(car.startingBid ?? car.minBid ?? 0)
      setActiveImage(car.images?.[0] || car.image || '/audi1.png')
      // Optional: Initialize wishlist status from backend
      setWishlisted(car.isWishlisted || false)
    }
  }, [car])

  const isOwner = useMemo(
    () =>
      auth.user &&
      car &&
      (car.seller === auth.user._id || car.seller?._id === auth.user._id),
    [auth.user, car]
  )

  const onBid = async () => {
    if (isOwner) {
      alert('You cannot bid on your own car.')
      return
    }
    await placeBid({ carId: id, amount })
      .unwrap()
      .catch(() => alert('Bid failed'))
  }

  const toggleWishlist = async () => {
    try {
      if (!wishlisted) {
        await addToWishlist(id).unwrap()
        setWishlisted(true)
      } else {
        await removeFromWishlist(id).unwrap()
        setWishlisted(false)
      }
    } catch (err) {
      console.error('Wishlist update failed', err)
    }
  }

  if (!car) return <div className="text-center mt-10">Loading...</div>

  const topBid = bids.length > 0 ? bids[0].amount : car.startingBid
  const topBidder = bids.length > 0 ? bids[0].user : null

  return (
    <div className="bg-[#dce3f5] min-h-screen">
      {/* Header */}
      <div className="text-center py-10">
        <h1 className="text-5xl font-bold text-[#1b2a6b]">
          {car.make} {car.model}
        </h1>
        <p className="text-gray-600 mt-2">
          Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus.
        </p>
        <p className="text-sm text-gray-500 mt-1">Home {'>'} Auction Detail</p>
      </div>

      {/* Auction Content */}
      <div className="max-w-[1200px] mx-auto bg-white rounded-lg overflow-hidden relative">
        {/* Title Row */}
        <div className="bg-[#1b2a6b] text-white px-6 py-3 flex justify-between items-center relative">
          <h2 className="font-semibold">
            {car.make} {car.model}
          </h2>
          {/* Wishlist Star */}
          <button
            onClick={toggleWishlist}
            className="absolute top-3 right-3 z-10"
          >
            <Star
              size={24}
              className={wishlisted ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}
            />
          </button>
        </div>

        {/* Image + Thumbnails */}
        <div className="grid grid-cols-4 gap-2 p-6">
          {/* Large Image */}
          <div className="col-span-3 relative">
            <Image
              src={activeImage || '/audi1.png'}
              alt="active"
              width={800}
              height={500}
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </div>

          {/* 6 Thumbnails */}
          <div className="grid grid-rows-6 gap-2">
            {(car.images || [car.image]).slice(0, 6).map((img: string, i: number) => (
              <Image
                key={i}
                src={img}
                alt="thumb"
                width={200}
                height={100}
                onClick={() => setActiveImage(img)}
                className={`w-full h-[60px] object-cover rounded-md cursor-pointer border
                  ${activeImage === img ? 'border-[#1b2a6b] border-2' : 'border-transparent'}`}
              />
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-7 text-center text-sm bg-white">
          <div className="py-3">{countdown}</div>
          <div className="py-3 font-bold">${topBid}</div>
          <div className="py-3">{new Date(car.endTime).toLocaleString()}</div>
          <div className="py-3">{car.minIncrement} Min. Increment</div>
          <div className="py-3">{bids.length} Total Bids</div>
          <div className="py-3">{car.lotNo} Lot No</div>
          <div className="py-3">{car.odometer} K.M</div>
        </div>

        {/* Description */}
        <div className="p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Description</h3>
          <p className="text-gray-200">{car.description}</p>
        </div>

        {/* Top Bidder */}
        {topBidder && (
          <div className="p-6 bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Top Bidder</h3>
            <div className="flex items-center space-x-4">
              <Image
                src={topBidder.avatar || '/placeholder.png'}
                alt={topBidder.name}
                width={64}
                height={64}
                className="rounded-full"
              />
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <span className="font-medium">Name:</span>
                <span>{topBidder.name}</span>
                <span className="font-medium">Email:</span>
                <span>{topBidder.email}</span>
                <span className="font-medium">Bid:</span>
                <span>${topBid}</span>
              </div>
              </div>
            </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="max-w-[1200px] mx-auto mt-6 grid grid-cols-3 gap-6">
        <div className="col-span-2"></div>
        <div className="space-y-6">
          {/* Place Bid */}
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span>Bid Starts From</span>
              <span>${car.startingBid}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Current Bid</span>
              <span>${topBid}</span>
            </div>

            {/* Plus / Minus Input */}
            <div className="flex items-center border rounded-lg">
              <button
                type="button"
                className="px-3 py-2 border-r"
                onClick={() =>
                  setAmount((prev) =>
                    Math.max(prev - (car.minIncrement || 1), topBid + 1)
                  )
                }
              >
                -
              </button>
              <input
                type="number"
                min={topBid + 1}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full text-center p-2"
              />
              <button
                type="button"
                className="px-3 py-2 border-l"
                onClick={() => setAmount((prev) => prev + (car.minIncrement || 1))}
              >
                +
              </button>
            </div>

            {/* Slider Control */}
            <input
              type="range"
              min={topBid + 1}
              max={90000}
              step={car.minIncrement || 1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-[#1b2a6b]"
            />

            <button
              onClick={onBid}
              className="w-full bg-[#1b2a6b] text-white py-3 rounded-lg"
            >
              Submit A Bid
            </button>
          </div>

          {/* Bidders List */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-lg mb-4">Bidders</h3>
            <ul className="space-y-2 max-h-[200px] overflow-y-auto">
              {bids.map((b, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span>{b.user?.name || 'Unknown'}</span>
                  <span>${b.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
