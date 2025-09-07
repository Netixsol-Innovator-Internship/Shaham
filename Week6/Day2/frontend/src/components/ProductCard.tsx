"use client";
import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, StarHalf } from "lucide-react";
import { useGetCurrentSaleQuery } from "@/lib/api";
import { calculateSalePrice, formatCurrency } from "@/lib/saleUtils";

interface ProductCardProps {
  _id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating?: number;
  loyaltyPoints?: number;
  variantId?: string; // 👈 add variantId
}

const ProductCard: FC<ProductCardProps> = ({
  _id,
  name,
  image,
  price,
  oldPrice,
  discount,
  rating,
  loyaltyPoints,
  variantId,
}) => {
  const { data: currentSale } = useGetCurrentSaleQuery();
  
  // Calculate sale pricing
  const pricing = calculateSalePrice(price, _id, currentSale);
  
  const fullStars = Math.floor(rating || 0);
  const hasHalfStar = (rating || 0) % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // 👇 Build link: if variantId exists, pass it as query param
  const productLink = variantId
    ? `/productdetails/${_id}?variantId=${variantId}`
    : `/productdetails/${_id}`;

  return (
    <Link href={productLink} className="w-full">
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
          {rating !== undefined && rating > 0 && (
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
          )}

          {/* Price / Loyalty Points */}
          <div className="mt-2">
            {/* Money Price - only show if price > 0 */}
            {price > 0 && (
              <div>
                {pricing.isOnSale ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-semibold text-red-600">
                      {formatCurrency(pricing.salePrice)}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {formatCurrency(pricing.originalPrice)}
                    </span>
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                      -{pricing.discountPercentage}% OFF
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatCurrency(price)}
                    </span>
                    {oldPrice && (
                      <span className="ml-2 text-sm text-gray-400 line-through">
                        {formatCurrency(oldPrice)}
                      </span>
                    )}
                    {discount && (
                      <span className="ml-2 text-sm text-red-500">-{discount}%</span>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Points Price - only show if loyaltyPoints > 0 */}
            {loyaltyPoints !== undefined && loyaltyPoints > 0 && (
              <p className="text-sm text-purple-600 mt-1 font-medium">
                {price > 0 ? "Or " : ""}{loyaltyPoints} pts
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
