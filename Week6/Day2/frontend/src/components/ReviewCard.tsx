"use client";
import { FC } from "react";
import { Star } from "lucide-react";

interface ReviewCardProps {
  name: string;
  text: string;
  rating: number;
}

const ReviewCard: FC<ReviewCardProps> = ({ name, text, rating }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 max-w-xs mb-2">
      {/* Stars */}
      <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={`${
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Name */}
      <h3 className="font-semibold text-gray-800">{name}</h3>

      {/* Text */}
      <p className="text-sm text-gray-600 mt-2">"{text}"</p>
    </div>
  );
};

export default ReviewCard;
