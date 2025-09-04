"use client";
import { useState } from "react";
import ReviewCard from "./ReviewCard";

const dummyReviews = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  name: `User ${i + 1}`,
  rating: Math.floor(Math.random() * 2) + 4,
  date: `August ${10 + i}, 2023`,
  comment: "Really loved this t-shirt. Fabric feels premium and comfy!",
}));

const ProductReviews = () => {
  const [reviews, setReviews] = useState(dummyReviews);
  const [filter, setFilter] = useState("Latest");
  const [page, setPage] = useState(1);
  const perPage = 6;

  const totalPages = Math.ceil(reviews.length / perPage);
  const paginated = reviews.slice((page - 1) * perPage, page * perPage);

  const handleFilterChange = (value: string) => {
    setFilter(value);
    let sorted = [...dummyReviews];
    if (value === "Latest") sorted = [...dummyReviews].reverse();
    if (value === "Oldest") sorted = [...dummyReviews];
    if (value === "Highest Rated") sorted.sort((a, b) => b.rating - a.rating);
    if (value === "Lowest Rated") sorted.sort((a, b) => a.rating - b.rating);
    setReviews(sorted);
    setPage(1);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">All Reviews ({reviews.length})</h2>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="border rounded-md px-3 py-1"
          >
            <option>Latest</option>
            <option>Oldest</option>
            <option>Highest Rated</option>
            <option>Lowest Rated</option>
          </select>
          <button className="bg-black text-white px-4 py-2 rounded-md">
            Write a Review
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginated.map((r) => (
          <ReviewCard key={r.id} name={r.name} text={r.comment} rating={r.rating} />
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
            className={`px-3 py-1 border rounded ${
              page === i + 1 ? "bg-black text-white" : ""
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
    </div>
  );
};

export default ProductReviews;
