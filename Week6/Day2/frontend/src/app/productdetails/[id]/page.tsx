"use client";
import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";
import ProductTabs from "@/components/ProductTabs";
import AlsoLike from "@/components/AlsoLike";

const ProductDetailsPage = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Top Section: Gallery + Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <ProductGallery />
        <ProductInfo />
      </div>

      {/* Tabs (Reviews, Details, FAQs) */}
      <div className="mt-12">
        <ProductTabs />
      </div>
      <AlsoLike />
    </div>
  );
};

export default ProductDetailsPage;
