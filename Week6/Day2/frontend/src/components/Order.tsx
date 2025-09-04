"use client";
import { FC, useState } from "react";

type OrderProps = {
  subtotal: number;
  discount: number;
  deliveryFee: number;
};

const Order: FC<OrderProps> = ({ subtotal, discount, deliveryFee }) => {
  const [promo, setPromo] = useState("");

  const total = subtotal - discount + deliveryFee;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm w-[350px]">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold">${subtotal}</span>
        </div>
        <div className="flex justify-between text-red-500">
          <span>Discount (-20%)</span>
          <span>- ${discount}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>${deliveryFee}</span>
        </div>
      </div>

      <hr className="my-4" />

      <div className="flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span>${total}</span>
      </div>

      {/* Promo Code */}
      <div className="flex mt-4">
        <input
          type="text"
          placeholder="Add promo code"
          value={promo}
          onChange={(e) => setPromo(e.target.value)}
          className="flex-1 rounded-l-full px-4 py-2 bg-gray-100 outline-none"
        />
        <button className="rounded-r-full bg-black text-white px-4 py-2">Apply</button>
      </div>

      <button className="w-full mt-6 bg-black text-white py-3 rounded-full font-semibold hover:opacity-90">
        Go to Checkout →
      </button>
    </div>
  );
};

export default Order;
