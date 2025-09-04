"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full bg-gray-200">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 lg:px-12 py-12">
        {/* Left Text */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h1
            className="text-4xl md:text-5xl font-extrabold leading-tight font-integral"
          >
            FIND CLOTHES <br />
            THAT MATCHES <br />
            YOUR STYLE
          </h1>
          <p
            className="text-gray-600 max-w-md mx-auto md:mx-0 font-satoshi"
          >
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-black text-white px-6 py-3 rounded-full font-medium font-satoshi"
          >
            Shop Now
          </Link>

          {/* Stats */}
          <div className="flex flex-wrap justify-center md:justify-start gap-8 pt-6">
            <div>
              <p className="text-2xl font-bold font-satoshi">
                200+
              </p>
              <p className="text-gray-600 text-sm font-satoshi">
                International Brands
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold font-satoshi">
                2,000+
              </p>
              <p className="text-gray-600 text-sm font-satoshi">
                High-Quality Products
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold font-satoshi">
                30,000+
              </p>
              <p className="text-gray-600 text-sm font-satoshi">
                Happy Customers
              </p>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 relative mt-10 md:mt-0">
          <Image
            src="/hero section.png"
            alt="Fashion Models"
            width={500}
            height={600}
            className="mx-auto"
          />

          <Image
            src="/star1.png"
            alt="Star"
            width={80}
            height={80}
            className="absolute top-10 right-12"
          />
          <Image
            src="/star2.png"
            alt="Star"
            width={40}
            height={40}
            className="absolute bottom-12 left-0"
          />
        </div>
      </div>

      {/* Brands Strip */}
      <div className="bg-black py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:justify-between items-center text-center gap-6">
            <Image src="/versace.png" alt="Versace" width={120} height={40} className="mx-auto" />
            <Image src="/zara.png" alt="Zara" width={120} height={40} className="mx-auto" />
            <Image src="/gucci.png" alt="Gucci" width={120} height={40} className="mx-auto" />
            <Image src="/prada.png" alt="Prada" width={120} height={40} className="mx-auto" />
            <Image src="/calvin klein.png" alt="Calvin Klein" width={140} height={40} className="mx-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
