'use client'
import { useSelector } from 'react-redux'
import { useMemo, useState } from 'react'
import { RootState } from '@/lib/store'
import Link from 'next/link'
import { useListActiveAuctionsQuery } from '@/lib/api'
import AuctionCard from '@/components/AuctionCard'

export default function Home() {
  const loggedIn = useSelector((s: RootState) => s.auth.loggedIn)
  const { data: auctions = [] } = useListActiveAuctionsQuery()
  const [q, setQ] = useState<{ type?: string; make?: string; model?: string }>({})
  const MAKES: Record<string, string[]> = useMemo(() => ({
    Toyota: ['Corolla', 'Camry', 'Prius'],
    BMW: ['3 Series', 'M4'],
    Honda: ['Civic', 'Accord'],
  }), [])
  const modelsForMake = useMemo(() => (q.make ? (MAKES[q.make] || []) : []), [q.make, MAKES])

  return (
    <div className="space-y-16 mt-[-65px]">
      {/* Hero search section */}
      <section className="relative w-full h-[500px] flex items-center justify-center text-white">
        {/* Full background image */}
        <img
          src="/bmw (2).png"
          alt="Find your dream car"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay for darkening */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Car</h1>
          <p className="mb-8 text-gray-200">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tellus
            elementum cursus tincidunt sagittis elementum suspendisse velit arcu.
          </p>

          {/* Search box */}
          <div className="bg-white shadow-lg rounded-md flex flex-wrap items-center gap-2 p-4">
            {/* Type */}
            <select
              disabled={!loggedIn}
              className="border p-2 rounded flex-1 text-black"
              value={q.type ?? ''}
              onChange={(e) => setQ({ ...q, type: e.target.value || undefined })}
            >
              <option value="">Any Car Type {loggedIn ? '' : '(login to use)'}</option>
              <option value="sedan">Sedan</option>
              <option value="sports">Sports</option>
              <option value="hatchback">Hatchback</option>
              <option value="convertible">Convertible</option>
            </select>
            {/* Make */}
            <select
              disabled={!loggedIn}
              className="border p-2 rounded flex-1 text-black"
              value={q.make ?? ''}
              onChange={(e) => {
                const newMake = e.target.value || undefined
                setQ({ type: q.type, make: newMake, model: undefined })
              }}
            >
              <option value="">Any Make</option>
              {Object.keys(MAKES).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {/* Model */}
            <select
              disabled={!loggedIn || !q.make}
              className="border p-2 rounded flex-1 disabled:opacity-60 text-black"
              value={q.model ?? ''}
              onChange={(e) => setQ({ ...q, model: e.target.value || undefined })}
            >
              <option value="">Any Model</option>
              {modelsForMake.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <button className="bg-[#3f4b8b] text-white px-6 py-2 rounded-md hover:bg-[#2f3a7b] transition">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Live auction section */}
      <section className="bg-[#3f4b8b] py-12 w-full mb-12">
        <div className="text-center mb-8">
          <Link href="/auctions">
            <h2 className="text-3xl font-bold text-white cursor-pointer hover:underline">
              Live Auction
            </h2>
          </Link>
          <img
            src="/live action underline group.png"
            alt="Divider"
            className="mx-auto mt-4"
          />
        </div>

        {/* Cards stay centered with padding, but blue bar goes full width */}
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {auctions.slice(0, 4).map((auction: any, i: number) => (
            <AuctionCard
              key={auction._id}
              auction={auction}
              trending={i < 2}
            />
          ))}
        </div>
      </section>

    </div>
  )
}
