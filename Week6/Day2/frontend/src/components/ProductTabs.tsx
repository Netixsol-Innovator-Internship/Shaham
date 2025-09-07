"use client";
import { useState, FC } from "react";
import ProductReviews from "./ProductReviews";

interface TabsProps {
  productId: string;
  reviews: any[];
}

const ProductTabs: FC<TabsProps> = ({ productId, reviews }) => {

  const [active, setActive] = useState("reviews");

  return (
    <div>
      {/* Tabs */}
      <div className="border-b flex gap-8">
        {["reviews", "details", "faqs"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`pb-2 font-medium ${
              active === tab ? "border-b-2 border-black" : "text-gray-500"
            }`}
          >
            {tab === "reviews"
              ? "Rating & Reviews"
              : tab === "details"
              ? "Product Details"
              : "FAQs"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-8">
        {active === "reviews" && <ProductReviews productId={productId} reviews={reviews} />}
        {active === "details" && <p>Product details go here...</p>}
        {active === "faqs" && <p>FAQs go here...</p>}
      </div>
    </div>
  );
};

export default ProductTabs;
