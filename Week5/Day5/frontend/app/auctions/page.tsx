'use client'
import { useEffect, useMemo, useState } from 'react'
import { useListCarsQuery } from '@/lib/api'
import Link from 'next/link'
import AuctionPageCard from '@/components/AuctionPageCard'

export default function Auctions() {
  const [q, setQ] = useState<{ type?: string; make?: string; model?: string }>({})
  // Hardcoded makes/models
  const MAKES: Record<string, string[]> = useMemo(() => ({
    Toyota: ['Corolla', 'Camry', 'Prius'],
    BMW: ['3 Series', 'M4'],
    Honda: ['Civic', 'Accord'],
  }), [])
  const modelsForMake = useMemo(() => (q.make ? (MAKES[q.make] || []) : []), [q.make, MAKES])
  const { data: cars = [], refetch } = useListCarsQuery(q)

  // Listen to auction refresh events from Navbar socket to refetch list
  useEffect(() => {
    const handler = () => refetch()
    window.addEventListener('auctions:refresh', handler)
    return () => window.removeEventListener('auctions:refresh', handler)
  }, [refetch])

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-[#D7E4F5] text-center py-10">
        <h1 className="text-4xl font-semibold text-[#273C75]">Auction</h1>
        <p className="text-gray-700 mt-2 max-w-xl mx-auto">
          Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus.
        </p>
        <div className="mt-4 text-gray-500 text-sm">
          <Link href="/" className="hover:underline">Home</Link> &gt; <span>Auction</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 py-10">
        {/* Left Section */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center bg-[#283A7A] text-white px-4 py-3 rounded-md">
            <span>Showing 1-5 of {cars.length} Results</span>
            <select className="bg-white text-gray-700 rounded px-3 py-2">
              <option>Sort By Newness</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          {/* Auction Cards */}
          <div className="space-y-4">
            {cars.map((c: any) => (
              <AuctionPageCard key={c._id} auction={c} />
            ))}
          </div>
        </div>

        {/* Right Section - Filters */}
        <div className="bg-[#283A7A] text-white rounded-md p-5">
          <h3 className="text-lg font-semibold mb-4">Filter By</h3>
          <div className="space-y-4">
            {/* Car Type */}
            <select
              className="w-full bg-transparent border border-white rounded px-3 py-2 text-black"
              value={q.type ?? ''}
              onChange={(e) => setQ({ ...q, type: e.target.value || undefined })}
            >
              <option value="">Any Car Type</option>
              <option value="sedan">Sedan</option>
              <option value="sports">Sports</option>
              <option value="hatchback">Hatchback</option>
              <option value="convertible">Convertible</option>
            </select>

            {/* Make */}
            <select
              className="w-full bg-transparent border border-white rounded px-3 py-2 text-black"
              value={q.make ?? ''}
              onChange={(e) => {
                const newMake = e.target.value || undefined
                setQ({
                  type: q.type,
                  make: newMake,
                  model: undefined,
                })
              }}
            >
              <option value="">Any Make</option>
              {Object.keys(MAKES).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            {/* Model */}
            <select
              className="w-full bg-transparent border border-white rounded px-3 py-2 text-black disabled:opacity-60"
              value={q.model ?? ''}
              onChange={(e) => setQ({ ...q, model: e.target.value || undefined })}
              disabled={!q.make}
            >
              <option value="">Any Model</option>
              {modelsForMake.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            {/* Price Range (Static for now) */}
            <div>
              <input type="range" min="30000" max="300000" className="w-full accent-yellow-400" />
              <p className="text-sm mt-1">Price: $30,000 - $30,000</p>
            </div>

            <button className="w-full bg-yellow-400 text-[#283A7A] font-semibold py-2 rounded hover:bg-yellow-500">
              Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
