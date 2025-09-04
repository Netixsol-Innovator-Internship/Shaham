"use client";
import { useState } from "react";

const dummyProduct = {
  title: "ONE LIFE GRAPHIC T-SHIRT",
  price: 260,
  oldPrice: 300,
  discount: 40,
  rating: 4.5,
  description:
    "This graphic t-shirt is perfect for any occasion. Crafted from soft, breathable fabric, it offers superior comfort and style.",
  colors: ["#3B3B1B", "#1E1E1E", "#2E3A59"],
  sizes: ["Small", "Medium", "Large", "X-Large"],
};

const ProductInfo = () => {
  const [color, setColor] = useState(dummyProduct.colors[0]);
  const [size, setSize] = useState("Large");
  const [qty, setQty] = useState(1);

  return (
    <div>
      <h1 className="text-2xl font-bold">{dummyProduct.title}</h1>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-yellow-500">⭐ {dummyProduct.rating}/5</span>
        <span className="text-sm text-gray-500">(451 reviews)</span>
      </div>

      <div className="flex items-center gap-3 mt-3">
        <span className="text-2xl font-bold">${dummyProduct.price}</span>
        <span className="text-gray-400 line-through">${dummyProduct.oldPrice}</span>
        <span className="text-red-500">-{dummyProduct.discount}%</span>
      </div>

      <p className="mt-4 text-gray-600">{dummyProduct.description}</p>

      {/* Colors */}
      <div className="mt-4">
        <p className="font-medium mb-2">Select Colors</p>
        <div className="flex gap-2">
          {dummyProduct.colors.map((c) => (
            <button
              key={c}
              aria-label="color"
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full border-2 ${
                color === c ? "border-black" : "border-gray-300"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="mt-4">
        <p className="font-medium mb-2">Choose Size</p>
        <div className="flex gap-2">
          {dummyProduct.sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`px-4 py-2 rounded-md border ${
                size === s ? "bg-black text-white border-black" : "border-gray-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity + Add to Cart */}
      <div className="flex items-center gap-4 mt-6">
        <div className="flex items-center border rounded-md">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2">
            -
          </button>
          <span className="px-4">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2">
            +
          </button>
        </div>
        <button className="flex-1 bg-black text-white py-3 rounded-md">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
