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
        const response = await fetch('http://localhost:5000/products');
        const data = await response.json();
        console.log("Manual API test result:", { status: response.status, data: data.slice(0, 2) });
      } catch (err) {
        console.error("Manual API test failed:", err);
      }
    };
    testAPI();
  }, []);

  const mapToCard = (p: any) => {
    // Get the first variant (or use product directly if no variants)
    const variant = p?.variants?.[0];

    // Extract image - prioritize variant images, then product image, then fallback
    const firstImage = variant?.images?.[0] || p?.image || p?.images?.[0] || "/shirt.png";

    // Extract price - prioritize sale price, then regular price, then fallback
    const price = variant?.salePrice ?? variant?.regularPrice ?? p?.price ?? p?.salePrice ?? p?.regularPrice ?? 0;

    // Extract old price - if there's a sale, use regular price as old price
    const oldPrice = variant?.salePrice && variant?.regularPrice ? variant.regularPrice :
      p?.salePrice && p?.regularPrice ? p.regularPrice : undefined;

    // Calculate discount
    const discount = oldPrice && price ? Math.max(0, Math.round(((oldPrice - price) / oldPrice) * 100)) : undefined;

    // Extract rating
    const rating = typeof p?.rating === "number" ? p.rating : 0;

    return {
      _id: p._id || p.id, // Use _id to match ProductSection interface
      name: p.name,
      image: firstImage,
      price,
      oldPrice,
      discount,
      rating,
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
          <div className="py-12 text-center text-gray-500">Loading products…</div>
        )}
        {isError && (
          <div className="py-12 text-center text-red-500">
            Failed to load products. Error: {error?.status || 'Unknown error'}
            <br />
            <small>Check console for details</small>
          </div>
        )}
        {!isLoading && !isError && products && products.length === 0 && (
          <div className="py-12 text-center text-gray-500">No products found in database.</div>
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
