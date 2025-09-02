// app/sell/page.tsx
import dynamic from 'next/dynamic'

// SellForm is a client component so we dynamic-import with ssr: false
const SellForm = dynamic(() => import('@/components/SellForm'), { ssr: false })

export default function SellPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="bg-[#dfe9fd]">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <h1 className="text-[44px] leading-tight font-extrabold text-[#2b3d7a]">Sell Your Car</h1>
          <div className="w-24 mx-auto mt-4 h-[3px] bg-[#2b3d7a]" />
          <p className="mt-4 text-sm text-[#5f6f9a]">
            Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus.
          </p>
          <div className="mt-6 inline-flex bg-[#cfe0ff] text-sm text-[#3f4b8b] px-3 py-1 rounded">
            Home &nbsp; &gt; &nbsp; Sell Your Car
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-extrabold mb-6">Tell us about your car</h2>
        <p className="text-gray-600 mb-8 max-w-2xl">
          Please give us some basics about yourself and car you'd like to sell. We'll also need details about the car's title status as well as photos that highlight the car's exterior and interior condition.
        </p>

        <SellForm />
      </main>
    </div>
  )
}
