import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import BrowseByStyle from "@/components/BrowseByStyle";
import ReviewStrip from "@/components/ReviewStrip";

export default function HomePage() {
  const newArrivals = [
    {
      id: "1",
      name: "T-shirt with Tape Details",
      slug: "t-shirt-with-tape-details",
      category: "t-shirts",
      description: "Comfortable cotton T-shirt with tape details",
      price: 120,
      rating: 4.5,
      image: "/shirt.png",
    },
    {
      id: "2",
      name: "Skinny Fit Jeans",
      slug: "skinny-fit-jeans",
      category: "jeans",
      description: "Stylish skinny fit jeans for casual wear",
      price: 240,
      oldPrice: 260,
      discount: 20,
      rating: 3.5,
      image: "/shirt.png",
    },
    {
      id: "3",
      name: "Checkered Shirt",
      slug: "checkered-shirt",
      category: "shirts",
      description: "Classic checkered shirt for casual & formal",
      price: 180,
      rating: 4.5,
      image: "/shirt.png",
    },
    {
      id: "4",
      name: "Sleeve Striped T-shirt",
      slug: "sleeve-striped-tshirt",
      category: "t-shirts",
      description: "Striped T-shirt with black sleeves",
      price: 130,
      oldPrice: 160,
      discount: 30,
      rating: 4.5,
      image: "/shirt.png",
    },
  ];

  const topSelling = [
    {
      id: "5",
      name: "Vertical Striped Shirt",
      slug: "vertical-striped-shirt",
      category: "shirts",
      description: "Formal striped shirt",
      price: 212,
      oldPrice: 232,
      discount: 20,
      rating: 5.0,
      image: "/shirt.png",
    },
    {
      id: "6",
      name: "Courage Graphic T-shirt",
      slug: "courage-graphic-tshirt",
      category: "t-shirts",
      description: "Casual graphic tee",
      price: 145,
      rating: 4.0,
      image: "/shirt.png",
    },
    {
      id: "7",
      name: "Loose Fit Bermuda Shorts",
      slug: "loose-fit-bermuda-shorts",
      category: "shorts",
      description: "Comfortable loose fit shorts",
      price: 80,
      rating: 3.0,
      image: "/shirt.png",
    },
    {
      id: "8",
      name: "Faded Skinny Jeans",
      slug: "faded-skinny-jeans",
      category: "jeans",
      description: "Trendy faded skinny jeans",
      price: 210,
      rating: 4.5,
      image: "/shirt.png",
    },
  ];

  return (
    <>
      <Hero />

      {/* Container for rest */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ProductSection title="NEW ARRIVALS" products={newArrivals} />
        <ProductSection title="TOP SELLING" products={topSelling} />
        <BrowseByStyle />
        <ReviewStrip />
      </div>
    </>
  );
}
