import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#3f4b8b] text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Car Logo" className="w-34 h-8" />
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur. Mauris eu convallis proin turpis pretium donec orci semper. Sit
              suscipit lacus cras commodo in lectus sed egestas. Mattis egestas sit viverra pretium tincidunt libero.
              Suspendisse aliquam donec leo nisl purus et quam pulvinar. Odio egestas egestas tristique et lectus
              viverra in sed mauris.
            </p>
          </div>

          {/* Column 1 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Home</h4>
            <div className="space-y-3 text-sm">
              <div>Help Center</div>
              <div>FAQ</div>
              <div>My Account</div>
              <div>My Account</div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Car Auction</h4>
            <div className="space-y-3 text-sm">
              <div>Help Center</div>
              <div>FAQ</div>
              <div>My Account</div>
              <div>My Account</div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-blue-600 py-4">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <span className="font-medium">Copyright 2022</span> All Rights Reserved
        </div>
      </div>
    </footer>
  )
}
