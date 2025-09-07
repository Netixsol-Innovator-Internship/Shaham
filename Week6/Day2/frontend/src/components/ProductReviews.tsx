"use client";
import { useState, useEffect, FC, FormEvent } from "react";
import { useAddReviewMutation } from "@/lib/api";
import toast from "react-hot-toast";
import ReviewCard from "./ReviewCard";

interface Review {
  _id?: string;
  name?: string;
  rating: number;
  comment?: string;
  createdAt?: string | Date;
}

const ProductReviews: FC<{ productId: string; reviews: Review[] }> = ({
  productId,
  reviews: initialReviews,
}) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews || []);
  const [filter, setFilter] = useState("Latest");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [addReview, { isLoading }] = useAddReviewMutation();

  const perPage = 6;

  // Update reviews when initialReviews prop changes
  useEffect(() => {
    setReviews(initialReviews || []);
  }, [initialReviews]);

  // sort/filter
  const sorted = [...reviews].sort((a, b) => {
    if (filter === "Latest") {
      return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
    }
    if (filter === "Oldest") {
      return new Date(a.createdAt || "").getTime() - new Date(b.createdAt || "").getTime();
    }
    if (filter === "Highest Rated") return b.rating - a.rating;
    if (filter === "Lowest Rated") return a.rating - b.rating;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / perPage) || 1;
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newReview = await addReview({
        productId,
        review: { rating, comment: comment.trim() || undefined },
      }).unwrap();
      toast.success("Review posted");

      // update reviews locally - newReview is the full product with all reviews
      const latestReview = newReview.reviews[newReview.reviews.length - 1];
      setReviews((prev) => [...prev, latestReview]);
      setShowForm(false);
      setRating(5);
      setComment("");
      setFilter("Latest");
      setPage(1);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to post review");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">All Reviews ({reviews.length})</h2>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
            className="border rounded-md px-3 py-1"
          >
            <option>Latest</option>
            <option>Oldest</option>
            <option>Highest Rated</option>
            <option>Lowest Rated</option>
          </select>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="bg-black text-white px-4 py-2 rounded-md"
          >
            {showForm ? "Cancel" : "Write a Review"}
          </button>
        </div>
      </div>

      {/* Review form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="border p-4 rounded-lg mb-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full border rounded-md px-3 py-2"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} {r === 1 ? "star" : "stars"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Review (optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded-md px-3 py-2 min-h-[100px]"
              placeholder="Share your thoughts..."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-black text-white px-4 py-2 rounded-md disabled:opacity-60"
          >
            {isLoading ? "Posting..." : "Submit"}
          </button>
        </form>
      )}

      {/* Reviews list */}
      {reviews?.length ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginated.map((r, i) => (
              <ReviewCard
                key={r._id || i}
                name={r.name || "Anonymous"}
                text={r.comment || ""}
                rating={r.rating}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 border rounded ${page === i + 1 ? "bg-black text-white" : ""
                  }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500">No reviews yet. Be the first!</p>
      )}
    </div>
  );
};

export default ProductReviews;
