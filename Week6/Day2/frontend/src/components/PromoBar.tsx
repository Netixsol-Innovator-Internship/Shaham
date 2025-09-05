"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";

export default function PromoBar() {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const [visible, setVisible] = useState(true);

  // Debug: log auth state
  useEffect(() => {
    console.log("PromoBar auth state:", isAuthenticated);
  }, [isAuthenticated]);

  // Hide if user manually closed or if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setVisible(false);
    }
  }, [isAuthenticated]);

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
