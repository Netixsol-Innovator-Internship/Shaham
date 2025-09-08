"use client";
import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import BrowseByStyle from "@/components/BrowseByStyle";
import ReviewStrip from "@/components/ReviewStrip";
import { useGetProductsQuery } from "@/lib/api";
import { useEffect } from "react";

export default function HomePage() {
  const { data: products, isLoading, isError, error } = useGetProductsQuery({});

  // Debug: log what we're getting
  console.log("Products API response:", { products, isLoading, isError, error });

  // Debug: log the first product structure
  useEffect(() => {
    if (products && products.length > 0) {
      console.log("First product structure:", products[0]);
      console.log("Products array length:", products.length);
    }
  }, [products]);

  // Manual test fetch to debug API issues
  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log("Testing API manually...");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products`
        );
        const data = await response.json();
        console.log("Manual API test result:", {
          status: response.status,
          data: data.slice(0, 2),
        });
      } catch (err) {
        console.error("Manual API test failed:", err);
      }
    };
    testAPI();
  }, []);

  const mapToCard = (p: any) => {
    const variant = p?.variants?.[0];

    const firstImage =
      variant?.images?.[0] || p?.image || p?.images?.[0] || "/shirt.png";

    const price =
      variant?.salePrice ??
      variant?.regularPrice ??
      p?.price ??
      p?.salePrice ??
      p?.regularPrice ??
      0;

    const oldPrice =
      variant?.salePrice && variant?.regularPrice
        ? variant.regularPrice
        : p?.salePrice && p?.regularPrice
        ? p.regularPrice
        : undefined;

    const discount =
      oldPrice && price
        ? Math.max(0, Math.round(((oldPrice - price) / oldPrice) * 100))
        : undefined;

    const rating =
      p?.reviews?.length > 0
        ? p.reviews.reduce(
            (sum: number, review: any) => sum + (review.rating || 0),
            0
          ) / p.reviews.length
        : p?.rating || 0;

    const loyaltyPoints = variant?.pointsPrice ?? p?.pointsPrice;
    const variantId = variant?._id;

    return {
      _id: p._id || p.id,
      name: p.name || "Unnamed Product",
      image: firstImage,
      price,
      oldPrice,
      discount,
      rating,
      loyaltyPoints,
      variantId,
    };
  };

  const newArrivals = (products || []).slice(0, 4).map(mapToCard);
  const topSelling = (products || []).slice(4, 8).map(mapToCard);

  return (
    <>
      <Hero />

      {/* Container for rest */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {isLoading && (
          <div className="py-12 text-center text-gray-500">
            Loading products…
          </div>
        )}
        {isError && (
          <div className="py-12 text-center text-red-500">
            Failed to load products. Error: {error?.status || "Unknown error"}
            <br />
            <small>Check console for details</small>
          </div>
        )}
        {!isLoading && !isError && products && products.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            No products found in database.
          </div>
        )}
        {!isLoading && !isError && products && products.length > 0 && (
          <>
            <ProductSection title="NEW ARRIVALS" products={newArrivals} />
            <ProductSection title="TOP SELLING" products={topSelling} />
          </>
        )}
        <BrowseByStyle />
        <ReviewStrip />
      </div>
    </>
  );
}
