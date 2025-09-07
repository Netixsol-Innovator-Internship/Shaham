"use client";
import { FC } from "react";
import ProductCard from "./ProductCard";

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating?: number;
  loyaltyPoints?: number;
  variantId?: string;
}

interface ProductSectionProps {
  title: string;
  products: Product[];
  showViewAll?: boolean; // optional
}

const ProductSection: FC<ProductSectionProps> = ({
  title,
  products,
  showViewAll = true,
}) => {
  // Debug: log what we're receiving
  console.log(`ProductSection "${title}" received:`, { products, count: products?.length });

  return (
    <section className="my-12 w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
      {!products || products.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No products found.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} {...product} />
          ))}
        </div>
      )}
      {showViewAll && (
        <div className="flex justify-center mt-6">
          <a 
            href="/productsdisplaypage"
            className="px-6 py-2 rounded-full border border-black hover:bg-black hover:text-white transition inline-block text-center"
          >
            View All
          </a>
        </div>
      )}
    </section>
  );
};

export default ProductSection;
