"use client";
import { FC, useMemo, useState } from "react";
import {
  useCheckoutMutation,
  useGetCartQuery,
} from "@/lib/api";
import toast from "react-hot-toast";

const Order: FC = () => {
  const [promo, setPromo] = useState("");
  const { data: cart } = useGetCartQuery();
  const [checkout, { isLoading }] = useCheckoutMutation();

  const subtotal = useMemo(() => {
    return (cart?.items || []).reduce((sum: number, it: any) => {
      // If purchase with points → price is 0 (handled separately)
      const price =
        it.purchaseMethod === "points" ? 0 : it.moneyPrice || 0;
      return sum + price * (it.qty || 1);
    }, 0);
  }, [cart]);

  const loyaltySubtotal = useMemo(() => {
    return (cart?.items || []).reduce((sum: number, it: any) => {
      return it.purchaseMethod === "points"
        ? sum + (it.pointsPrice || 0) * (it.qty || 1)
        : sum;
    }, 0);
  }, [cart]);

  const deliveryFee = useMemo(() => (subtotal > 0 ? 15 : 0), [subtotal]);
  const discount = 0;
  const total = subtotal - discount + deliveryFee;

  const onCheckout = async () => {
    // Check if cart is empty
    if (!cart?.items || cart.items.length === 0) {
      toast.error("Your cart is empty. Add some items before checkout.");
      return;
    }

    try {
      const result = await checkout({
        paymentMethod: total > 0 ? "mock" : "points",
        purchaseMethod: total > 0 ? "money" : "points",
        discount: 0,
        address: { street: "N/A", city: "N/A", state: "N/A", zip: "00000" },
      }).unwrap();
      
      // Show success notification
      toast.success("Payment completed! Your order has been placed successfully.");
      
      console.log("Checkout successful:", result);
    } catch (error: any) {
      console.error("Checkout failed:", error);
      toast.error(error?.data?.message || "Checkout failed. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm w-[350px]">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold">
            ${subtotal}
            {loyaltySubtotal > 0 && ` + ${loyaltySubtotal} pts`}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>${deliveryFee}</span>
        </div>
      </div>

      <hr className="my-4" />

      <div className="flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span>
          ${total}
          {loyaltySubtotal > 0 && ` + ${loyaltySubtotal} pts`}
        </span>
      </div>

      <div className="flex mt-4">
        <input
          type="text"
          placeholder="Add promo code"
          value={promo}
          onChange={(e) => setPromo(e.target.value)}
          className="flex-1 rounded-l-full px-4 py-2 bg-gray-100 outline-none"
        />
        <button className="rounded-r-full bg-black text-white px-4 py-2">
          Apply
        </button>
      </div>

      <button
        onClick={onCheckout}
        disabled={isLoading || !cart?.items || cart.items.length === 0}
        className={`w-full mt-6 py-3 rounded-full font-semibold transition-all ${
          isLoading || !cart?.items || cart.items.length === 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-black text-white hover:opacity-90"
        }`}
      >
        {isLoading ? "Processing…" : "Go to Checkout →"}
      </button>
    </div>
  );
};

export default Order;
