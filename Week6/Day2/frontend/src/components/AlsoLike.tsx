"use client";
import ProductCard from "@/components/ProductCard";
import { useGetProductsQuery } from "@/lib/api";

const AlsoLike = () => {
  const { data } = useGetProductsQuery({});
  const products = (data || []).slice(0, 4).map((p: any) => {
    const image = p?.image || p?.images?.[0] || p?.variants?.[0]?.images?.[0] || "/shirt.png";
    const price = p?.price ?? p?.salePrice ?? p?.variants?.[0]?.salePrice ?? p?.variants?.[0]?.regularPrice ?? 0;
    const oldPrice = p?.variants?.[0]?.salePrice ? p?.variants?.[0]?.regularPrice : undefined;
    const discount = oldPrice && price ? Math.max(0, Math.round(((oldPrice - price) / oldPrice) * 100)) : undefined;
    const rating = typeof p?.rating === 'number' ? p.rating : 0;
    return { _id: p._id || p.id, name: p.name, image, price, oldPrice, discount, rating };
  });

  return (
    <section className="max-w-7xl mx-auto px-6 my-16">
      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-center mb-10">
        YOU MIGHT ALSO LIKE
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p._id} {...p} />
        ))}
      </div>
    </section>
  );
};

export default AlsoLike;
