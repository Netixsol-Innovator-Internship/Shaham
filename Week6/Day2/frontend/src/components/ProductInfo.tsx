"use client";
import { useState, useEffect } from "react";

export default function ProductInfo({
  id,
  name,
  description,
  rating,
  price,
  oldPrice,
  discount,
  pointsPrice,
  purchaseMethod,
  colors,
  sizes,
  selectedColor,
  selectedSize,
  setSelectedColor,
  setSelectedSize,
  onAddToCart,
  onVariantChange,
  // selectedVariantId,
}: {
  id: string;
  name: string;
  description?: string;
  rating?: number;
  price: number;
  oldPrice?: number;
  discount?: number;
  pointsPrice?: number;
  purchaseMethod?: string;
  colors: { id: string; color: string }[];
  sizes: string[];
  selectedColor: string;
  selectedSize: string;
  setSelectedColor: (color: string) => void;
  setSelectedSize: (size: string) => void;
  onAddToCart: (args: {
    productId: string;
    price: number;
    size: string;
    color: string;
    qty: number;
    purchaseMethod: "money" | "points";
  }) => void;
  onVariantChange?: (variantId: string) => void;
}) {
  const [qty, setQty] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"money" | "points">("money");

  // Reset selected size if sizes change
  useEffect(() => {
    if (sizes.length && !sizes.includes(selectedSize)) {
      setSelectedSize(sizes[0]);
    }
  }, [sizes, selectedSize, setSelectedSize]);

  return (
    <div>
      <h1 className="text-2xl font-bold">{name}</h1>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-yellow-500">⭐ {rating ?? 0}/5</span>
      </div>

      {/* Pricing Section */}
      <div className="mt-3">
        {/* Money Pricing - only show if price > 0 */}
        {price > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">${price}</span>
            {oldPrice && <span className="text-gray-400 line-through">${oldPrice}</span>}
            {discount && <span className="text-red-500">-{discount}%</span>}
          </div>
        )}
        
        {/* Points Pricing - only show if pointsPrice > 0 */}
        {pointsPrice && pointsPrice > 0 && (
          <div className="flex items-center gap-3 mt-2">
            <span className="text-2xl font-bold text-purple-600">{pointsPrice} pts</span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Loyalty Points</span>
          </div>
        )}
        
        {/* Payment Method Selection for Hybrid Products */}
        {purchaseMethod === 'hybrid' && price > 0 && pointsPrice && pointsPrice > 0 && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Choose Payment Method:</p>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPaymentMethod("money")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPaymentMethod === "money"
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Pay ${price}
              </button>
              <button
                onClick={() => setSelectedPaymentMethod("points")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPaymentMethod === "points"
                    ? "bg-purple-500 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Pay {pointsPrice} pts
              </button>
            </div>
          </div>
        )}
      </div>

      {description && <p className="mt-4 text-gray-600">{description}</p>}

      {/* Colors */}
      {colors.length > 0 && (
        <div className="mt-4">
          <p className="font-medium mb-2">Select Color</p>
          <div className="flex gap-2">
            {colors.map(({ id: variantId, color }) => (
              <button
                key={variantId}
                aria-label={`color-${color}`}
                onClick={() => {
                  setSelectedColor(color);
                  onVariantChange?.(variantId);
                }}
                className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? "border-black" : "border-gray-300"
                  }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {sizes.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Size</h4>
          <div className="flex gap-2 flex-wrap">
            {sizes.map(s => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`px-4 py-2 border rounded-md ${
                  selectedSize === s ? "bg-black text-white" : "bg-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity + Add to Cart */}
      <div className="flex items-center gap-4 mt-6">
        <div className="flex items-center border rounded-md">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2">-</button>
          <span className="px-4">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2">+</button>
        </div>
        <button
          className="flex-1 bg-black text-white py-3 rounded-md"
          onClick={() => {
            // Determine which payment method to use
            let finalPaymentMethod: "money" | "points" = "money";
            
            if (purchaseMethod === 'points') {
              finalPaymentMethod = "points";
            } else if (purchaseMethod === 'hybrid') {
              finalPaymentMethod = selectedPaymentMethod;
            } else if (purchaseMethod === 'money' || price > 0) {
              finalPaymentMethod = "money";
            }
            
            onAddToCart({
              productId: id,
              price: finalPaymentMethod === "points" ? (pointsPrice || 0) : price,
              size: selectedSize,
              color: selectedColor,
              qty,
              purchaseMethod: finalPaymentMethod,
            });
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
