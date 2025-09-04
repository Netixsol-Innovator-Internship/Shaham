"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export default function PromoBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-black text-white text-sm px-4 py-2 flex items-center justify-center relative">
      <p className="text-center">
        Sign up and get <span className="font-semibold">20% off</span> to your first order.{" "}
        <Link href="/signup" className="underline hover:text-gray-300">
          Sign Up Now
        </Link>
      </p>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2"
      >
        <X size={18} />
      </button>
    </div>
  );
}
