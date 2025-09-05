"use client";
import { useState } from "react";

const ProductReviews = () => {
  const [showWriteReview, setShowWriteReview] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Product Reviews</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowWriteReview(!showWriteReview)}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Write a Review
          </button>
        </div>
      </div>

      {showWriteReview && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
          <p className="text-gray-600 mb-4">
            The review system is currently under development. Please check back soon to share your feedback!
          </p>
          <button
            onClick={() => setShowWriteReview(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
      )}

      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
        <p className="text-gray-600">
          Be the first to review this product! The review system is being implemented and will be available soon.
        </p>
      </div>
    </div>
  );
};

export default ProductReviews;
