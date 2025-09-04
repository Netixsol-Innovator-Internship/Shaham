"use client"; 
import { FC } from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
}

interface ProductSectionProps {
  title: string;
  products: Product[];
  showViewAll?: boolean; // optional
}

const ProductSection: FC<ProductSectionProps> = ({ title, products, showViewAll = true }) => {
  return (
    <section className="my-12 w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      {showViewAll && (
        <div className="flex justify-center mt-6">
          <button className="px-6 py-2 rounded-full border border-black hover:bg-black hover:text-white transition">
            View All
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductSection;
