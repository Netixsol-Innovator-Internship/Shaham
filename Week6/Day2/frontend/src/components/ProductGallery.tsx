"use client";
import { useState } from "react";

const dummyImages = ["/shirt.png", "/shirt2.png", "/shirt.png", "/shirt2.png"];

const ProductGallery = () => {
  const [selected, setSelected] = useState(dummyImages[0]);

  return (
    <div>
      <img src={selected} alt="Product" className="w-full rounded-lg border" />
      <div className="flex gap-3 mt-4">
        {dummyImages.map((img) => (
          <img
            key={img}
            src={img}
            alt="Thumbnail"
            onClick={() => setSelected(img)}
            className={`w-20 h-20 rounded-lg border cursor-pointer ${
              selected === img ? "border-black" : "border-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
