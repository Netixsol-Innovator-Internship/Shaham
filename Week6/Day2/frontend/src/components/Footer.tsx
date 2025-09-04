'use client'

import { FaTwitter, FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa"
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcApplePay, FaGooglePay } from "react-icons/fa6"

export default function Footer() {
  return (
    <footer className="text-black relative">
      {/* Newsletter Section */}
      <div className="px-4 md:px-10 lg:px-20 relative z-10">
        <div className="bg-black text-white px-6 py-10 md:px-20 md:py-14 rounded-2xl mt-6 relative">
          <div className="flex flex-col items-center text-center md:flex-row md:items-center md:justify-between md:text-left gap-10">
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight uppercase">
              Stay upto date about <br className="hidden md:block" />
              our latest offers
            </h2>

            {/* Email + Button */}
            <div className="mt-6 md:mt-0 flex flex-col gap-3 w-full max-w-md">
              {/* Email box (white background) */}
              <div className="flex items-center bg-white text-gray-500 rounded-full px-4 py-3">
                <span className="mr-2">✉️</span>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 outline-none bg-transparent text-sm text-gray-700"
                />
              </div>

              {/* Subscribe button */}
              <button className="bg-white text-black font-semibold py-3 rounded-full hover:bg-gray-200">
                Subscribe to Newsletter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-300 mt-[-6rem] pt-[6rem] pb-12 px-6 md:px-20">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mt-10">
          {/* Logo & Social */}
          <div>
            <h3 className="text-2xl font-extrabold">SHOP.CO</h3>
            <p className="mt-4 text-sm text-gray-600">
              We have clothes that suits your style and <br />
              which you’re proud to wear. From <br />
              women to men.
            </p>
            <div className="flex gap-3 mt-4 text-xl text-gray-700">
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaGithub /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold uppercase text-sm">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li><a href="#">About</a></li>
              <li><a href="#">Features</a></li>
              <li><a href="#">Works</a></li>
              <li><a href="#">Career</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold uppercase text-sm">Help</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li><a href="#">Customer Support</a></li>
              <li><a href="#">Delivery Details</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold uppercase text-sm">FAQ</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li><a href="#">Account</a></li>
              <li><a href="#">Manage Deliveries</a></li>
              <li><a href="#">Orders</a></li>
              <li><a href="#">Payments</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold uppercase text-sm">Resources</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li><a href="#">Free eBooks</a></li>
              <li><a href="#">Development Tutorial</a></li>
              <li><a href="#">How to - Blog</a></li>
              <li><a href="#">Youtube Playlist</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
          <p>Shop.co © 2000-2023, All Rights Reserved</p>
          <div className="flex gap-3 mt-4 md:mt-0 text-3xl text-gray-700">
            <FaCcVisa />
            <FaCcMastercard />
            <FaCcPaypal />
            <FaCcApplePay />
            <FaGooglePay />
          </div>
        </div>
      </div>
    </footer>
  )
}
