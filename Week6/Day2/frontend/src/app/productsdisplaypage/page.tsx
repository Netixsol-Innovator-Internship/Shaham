"use client";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Filters from "@/components/Filters";
import ProductCard from "@/components/ProductCard";

const sizes = [
  "xx-small", "x-small", "small", "medium",
  "large", "x-large", "xx-large",
  "3x-large", "4x-large",
];

const dummyProducts = Array.from({ length: 30 }, (_, i) => ({
  id: (i + 1).toString(), // 👈 string for ProductCard
  name: `Product ${i + 1}`,
  image: "/shirt.png",
  price: 100 + i * 5,
  oldPrice: i % 3 === 0 ? 120 + i * 5 : undefined,
  discount: i % 3 === 0 ? 20 : undefined,
  rating: Number((Math.random() * 5).toFixed(1)),
  category: ["t-shirts", "shorts", "shirts", "hoodie", "jeans"][i % 5],
  style: ["casual", "formal", "party", "gym"][i % 4],
  color: [
    "green", "red", "yellow", "orange", "lightblue",
    "navy", "purple", "pink", "black", "white",
  ][i % 10],
  size: sizes[i % sizes.length], // 👈 added
}));

export default function ProductsDisplayPage() {
  const searchParams = useSearchParams();
  const styleParam = searchParams.get("style");

  const [filters, setFilters] = useState<any>({
    category: [],
    style: styleParam ? [styleParam] : [],
    colors: [],
    size: "", // 👈 added
    price: [50, 200],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  // Update filters if style param changes (e.g. user navigates again)
  useEffect(() => {
    if (styleParam) {
      setFilters((prev: any) => ({ ...prev, style: [styleParam] }));
    }
  }, [styleParam]);

  const filteredProducts = useMemo(() => {
    return dummyProducts.filter((p) => {
      const inCategory =
        filters.category.length === 0 || filters.category.includes(p.category);
      const inStyle =
        filters.style.length === 0 || filters.style.includes(p.style);
      const inColor =
        filters.colors.length === 0 || filters.colors.includes(p.color);
      const inPrice =
        p.price >= filters.price[0] && p.price <= filters.price[1];
      const inSize = !filters.size || p.size === filters.size;

      return inCategory && inStyle && inColor && inPrice && inSize;
    });
  }, [filters]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="flex gap-6 p-6">
      <Filters filters={filters} setFilters={setFilters} />

      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <div className="grid grid-cols-3 gap-6">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              image={product.image}
              price={product.price}
              oldPrice={product.oldPrice}
              discount={product.discount}
              rating={Number(product.rating)}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
