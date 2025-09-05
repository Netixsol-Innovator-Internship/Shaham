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
  colors,
  sizes,
  selectedColor,
  selectedSize,
  setSelectedColor,
  setSelectedSize,
  onAddToCart,
  onVariantChange,
  selectedVariantId,
}: {
  id: string;
  name: string;
  description?: string;
  rating?: number;
  price: number;
  oldPrice?: number;
  discount?: number;
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

      <div className="flex items-center gap-3 mt-3">
        <span className="text-2xl font-bold">${price}</span>
        {oldPrice && <span className="text-gray-400 line-through">${oldPrice}</span>}
        {discount && <span className="text-red-500">-{discount}%</span>}
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

      {/* Sizes - styled like Filters component */}
      {sizes.length > 0 && (
        <div className="mt-4">
          <p className="font-medium mb-2">Select Size</p>
          <div className="flex gap-2 flex-wrap">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`px-3 py-1 rounded-full text-sm border ${selectedSize === s
                  ? "bg-black text-white border-black"
                  : "bg-gray-100 text-gray-700 border-gray-300"
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
          onClick={() =>
            onAddToCart({
              productId: id,
              price,
              size: selectedSize,
              color: selectedColor,
              qty,
              purchaseMethod: "money",
            })
          }
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
