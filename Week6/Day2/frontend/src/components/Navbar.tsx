"use client";

import { useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import {
  Menu,
  ShoppingCart,
  User,
  Search,
  ChevronDown,
  X,
} from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);

  const categories = [
    { name: "Casual", href: "/productsdisplaypage?style=casual" },
    { name: "Formal", href: "/productsdisplaypage?style=formal" },
    { name: "Gym", href: "/productsdisplaypage?style=gym" },
    { name: "Party", href: "/productsdisplaypage?style=party" },
  ];

  return (
    <nav className="w-full border-b bg-white relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Logo + Nav links (desktop) */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="text-2xl font-extrabold">
              SHOP.CO
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6 relative">
              {/* Shop Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 hover:text-gray-700">
                  Shop <ChevronDown className="w-4 h-4" />
                </button>
                {/* Dropdown */}
                <div className="absolute left-0 mt-2 w-40 bg-white border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transform transition-all duration-200 invisible group-hover:visible">
                  <ul className="py-2">
                    {categories.map((cat) => (
                      <li key={cat.name}>
                        <Link
                          href={cat.href}
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link href="/sale">On Sale</Link>
              <Link href="/new-arrivals">New Arrivals</Link>
              <Link href="/brands">Brands</Link>
            </div>
          </div>

          {/* Middle: Search (desktop) */}
          <div className="hidden md:flex flex-1 justify-center px-4">
            <div className="w-full max-w-lg flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search for products..."
                className="bg-transparent outline-none flex-1 text-sm"
              />
            </div>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-4">
            {/* Mobile Search */}
            <button className="md:hidden">
              <Search className="w-6 h-6" />
            </button>

            {/* Cart → Link to /cart */}
            <Link href="/cart" className="hover:text-gray-600">
              <ShoppingCart className="w-6 h-6" />
            </Link>

            {/* User Account */}
            {isAuthenticated ? (
              <Link href="/profile" className="hover:text-gray-600">
                <User className="w-6 h-6" />
              </Link>
            ) : (
              <Link href="/login" className="hover:text-gray-600">
                <User className="w-6 h-6" />
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-16 left-0 w-full bg-white border-t shadow-md transition-all duration-300 overflow-hidden ${mobileOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="flex flex-col p-4 gap-4">
          {/* Shop with dropdown inside mobile */}
          <div>
            <span className="flex items-center gap-1">
              Shop <ChevronDown className="w-4 h-4" />
            </span>
            <div className="pl-4 mt-2 flex flex-col gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="text-sm hover:text-gray-700"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/sale">On Sale</Link>
          <Link href="/new-arrivals">New Arrivals</Link>
          <Link href="/brands">Brands</Link>
        </div>
      </div>
    </nav>
  );
}
