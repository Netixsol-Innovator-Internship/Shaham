"use client";
import { FC, useMemo, useState } from "react";
import {
  useCheckoutMutation,
  useGetCartQuery,
  useGetPointsBalanceQuery,
  useGetCurrentSaleQuery,
} from "@/lib/api";
import { calculateSalePrice } from "@/lib/saleUtils";
import toast from "react-hot-toast";

const Order: FC = () => {
  const [promo, setPromo] = useState("");
  const { data: cart } = useGetCartQuery();
  const { data: pointsData } = useGetPointsBalanceQuery();
  const { data: currentSale } = useGetCurrentSaleQuery();
  const [checkout, { isLoading }] = useCheckoutMutation();
  
  const userPointsBalance = pointsData?.loyaltyPoints || 0;

  const subtotal = useMemo(() => {
    return (cart?.items || []).reduce((sum: number, it: any) => {
      // If purchase with points → price is 0 (handled separately)
      if (it.purchaseMethod === "points") {
        return sum;
      }
      
      // Calculate sale price for money purchases
      const originalPrice = it.moneyPrice || 0;
      const saleInfo = calculateSalePrice(originalPrice, it.productId, currentSale);
      const finalPrice = saleInfo.salePrice;
      
      return sum + finalPrice * (it.qty || 1);
    }, 0);
  }, [cart, currentSale]);

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

    // Check if user has sufficient points for points purchases
    if (loyaltySubtotal > 0 && userPointsBalance < loyaltySubtotal) {
      toast.error(`Insufficient loyalty points. Required: ${loyaltySubtotal}, Available: ${userPointsBalance}`);
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
      
      {/* User Points Balance */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Your Loyalty Points</span>
          <span className="font-bold text-purple-600">{userPointsBalance} pts</span>
        </div>
        {loyaltySubtotal > 0 && (
          <div className="text-xs text-gray-500 mt-1">
            {userPointsBalance >= loyaltySubtotal ? (
              <span className="text-green-600">✓ Sufficient points for this order</span>
            ) : (
              <span className="text-red-600">⚠ Need {loyaltySubtotal - userPointsBalance} more points</span>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        {subtotal > 0 && (
          <div className="flex justify-between">
            <span>Money Subtotal</span>
            <span className="font-semibold">${subtotal}</span>
          </div>
        )}
        {loyaltySubtotal > 0 && (
          <div className="flex justify-between">
            <span>Points Subtotal</span>
            <span className="font-semibold text-purple-600">{loyaltySubtotal} pts</span>
          </div>
        )}
        {deliveryFee > 0 && (
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>${deliveryFee}</span>
          </div>
        )}
      </div>

      <hr className="my-4" />

      <div className="flex justify-between font-semibold text-lg">
        <span>Total</span>
        <div className="text-right">
          {total > 0 && <div>${total}</div>}
          {loyaltySubtotal > 0 && <div className="text-purple-600">{loyaltySubtotal} pts</div>}
        </div>
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
