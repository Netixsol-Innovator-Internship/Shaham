"use client";
import { useMemo, useState } from "react";

export default function ProductGallery({ images }: { images: string[] }) {
  const safeImages = useMemo(() => (images && images.length ? images : ["/shirt.png"]), [images]);
  const [selected, setSelected] = useState(safeImages[0]);

  return (
    <div>
      <img src={selected} alt="Product" className="w-full rounded-lg border" />
      <div className="flex gap-3 mt-4">
        {safeImages.map((img) => (
          <img
            key={img}
            src={img}
            alt="Thumbnail"
            onClick={() => setSelected(img)}
            className={`w-20 h-20 rounded-lg border cursor-pointer ${selected === img ? "border-black" : "border-gray-300"
              }`}
          />
        ))}
      </div>
    </div>
  );
}
