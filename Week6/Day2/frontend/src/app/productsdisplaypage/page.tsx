"use client";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Filters from "@/components/Filters";
import ProductCard from "@/components/ProductCard";
import { useGetProductsQuery } from "@/lib/api";

const sizes = [
  "xx-small", "x-small", "small", "medium",
  "large", "x-large", "xx-large",
  "3x-large", "4x-large",
];

export default function ProductsDisplayPage() {
  const searchParams = useSearchParams();
  const styleParam = searchParams.get("style");

  const [filters, setFilters] = useState<any>({
    category: [],
    style: styleParam ? [styleParam] : [],
    colors: [],
    size: "",
    price: [0, 10000],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const { data, isLoading, isError } = useGetProductsQuery({
    style: filters.style[0],
    category: filters.category[0],
    size: filters.size,
    minPrice: filters.price?.[0],
    maxPrice: filters.price?.[1],
    color: filters.colors[0],
  } as any);

  const backendProducts = useMemo(() => {
    if (!data) return [];

    return data.flatMap((p: any) =>
      (p.variants || []).map((variant: any) => {
        const price =
          variant?.salePrice ?? variant?.regularPrice ?? p.price ?? 0;
        const oldPrice = variant?.salePrice
          ? variant?.regularPrice
          : undefined;
        const discount =
          oldPrice && price
            ? Math.round(((oldPrice - price) / oldPrice) * 100)
            : undefined;

        return {
          _id: p._id,
          variantId: variant._id,
          parentId: p._id,
          name: p.name,
          image: variant?.images?.[0] || "/shirt.png",
          price,
          oldPrice,
          discount,
          rating: typeof p?.rating === "number" ? p.rating : 0,
          category: p.category,
          style: p.style,
          color: variant?.color,
        };
      })
    );
  }, [data]);

  // Debug raw API + processed products
  useEffect(() => {
    console.log("Raw API data:", data);
    console.log("Backend mapped products:", backendProducts);
  }, [data, backendProducts]);

  // Sync style filter if query param changes
  useEffect(() => {
    if (styleParam) {
      setFilters((prev: any) => ({ ...prev, style: [styleParam] }));
    }
  }, [styleParam]);

  // Apply frontend filters (on top of backend query filters)
  const filteredProducts = useMemo(() => {
    return backendProducts.filter((p: any) => {
      const inCategory =
        filters.category.length === 0 ||
        filters.category.map((c: string) => c.toLowerCase()).includes(p.category?.toLowerCase());

      const inStyle =
        filters.style.length === 0 ||
        filters.style.map((s: string) => s.toLowerCase()).includes(p.style?.toLowerCase());

      const inColor =
        filters.colors.length === 0 ||
        filters.colors.map((clr: string) => clr.toLowerCase()).includes(p.color?.toLowerCase());

      const inPrice =
        p.price >= filters.price[0] && p.price <= filters.price[1];

      return inCategory && inStyle && inColor && inPrice;
    });
  }, [filters, backendProducts]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  useEffect(() => {
    console.log("Filtered products:", filteredProducts);
  }, [filteredProducts]);

  return (
    <div className="flex gap-6 p-6">
      <Filters filters={filters} setFilters={setFilters} />

      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">Products</h2>

        {isLoading && <div className="py-8 text-gray-500">Loading…</div>}
        {isError && (
          <div className="py-8 text-red-500">Failed to load products.</div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="grid grid-cols-3 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  _id={product._id}
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
          </>
        )}
      </div>
    </div>
  );
}
