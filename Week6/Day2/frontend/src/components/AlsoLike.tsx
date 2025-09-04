"use client";
import ProductCard from "@/components/ProductCard";

const AlsoLike = () => {
  // Dummy data
  const products = [
    {
      id: "1",
      name: "Polo with Contrast Trims",
      image: "/polo-blue.png",
      price: 212,
      oldPrice: 242,
      discount: 20,
      rating: 4.0,
    },
    {
      id: "2",
      name: "Gradient Graphic T-shirt",
      image: "/gradient-tee.png",
      price: 145,
      rating: 3.5,
    },
    {
      id: "3",
      name: "Polo with Tipping Details",
      image: "/polo-red.png",
      price: 180,
      rating: 4.5,
    },
    {
      id: "4",
      name: "Black Striped T-shirt",
      image: "/striped-tee.png",
      price: 120,
      oldPrice: 150,
      discount: 30,
      rating: 5.0,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 my-16">
      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-center mb-10">
        YOU MIGHT ALSO LIKE
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </section>
  );
};

export default AlsoLike;
