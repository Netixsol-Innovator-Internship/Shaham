"use client";
import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, StarHalf } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
}

const ProductCard: FC<ProductCardProps> = ({
  id,
  name,
  image,
  price,
  oldPrice,
  discount,
  rating,
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <Link href={`/productdetails/${id}`} className="w-full">
      <div className="flex flex-col items-center bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition">
        {/* Product Image */}
        <div className="w-40 h-40 relative">
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div className="mt-4 text-center">
          <p className="text-sm font-medium text-gray-800">{name}</p>

          {/* Ratings */}
          <div className="flex items-center justify-center mt-1 gap-1">
            {[...Array(fullStars)].map((_, i) => (
              <Star
                key={`full-${i}`}
                size={14}
                className="fill-yellow-400 text-yellow-400"
              />
            ))}
            {hasHalfStar && (
              <StarHalf size={14} className="fill-yellow-400 text-yellow-400" />
            )}
            {[...Array(emptyStars)].map((_, i) => (
              <Star key={`empty-${i}`} size={14} className="text-gray-300" />
            ))}

            <span className="text-xs text-gray-500 ml-1">
              {rating.toFixed(1)}/5
            </span>
          </div>

          {/* Price */}
          <div className="mt-2">
            <span className="text-lg font-semibold text-gray-900">${price}</span>
            {oldPrice && (
              <span className="ml-2 text-sm text-gray-400 line-through">
                ${oldPrice}
              </span>
            )}
            {discount && (
              <span className="ml-2 text-sm text-red-500">-{discount}%</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
