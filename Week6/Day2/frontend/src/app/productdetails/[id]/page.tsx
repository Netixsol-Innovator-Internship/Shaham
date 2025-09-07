"use client";
import { useState, useEffect, useMemo } from "react";
import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";
import ProductTabs from "@/components/ProductTabs";
import AlsoLike from "@/components/AlsoLike";
import { useParams, useSearchParams } from "next/navigation";
import { useGetProductQuery, useAddToCartMutation } from "@/lib/api";
import toast from "react-hot-toast";

const ProductDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const productId = params?.id as string;
  const variantIdFromURL = searchParams.get("variantId");

  const { data: product } = useGetProductQuery(productId, { skip: !productId });
  const [addToCart] = useAddToCartMutation();

  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  // Update selected variant, color, size when product loads
  useEffect(() => {
    if (!product?.variants?.length) return;
    const initialVariant =
      product.variants.find((v: any) => v._id === variantIdFromURL) ||
      product.variants[0];

    setSelectedVariant(initialVariant);
    setSelectedColor(initialVariant.color);
    // selectedSize will be set when sizes are available
    setSelectedSize("");
  }, [product, variantIdFromURL]);

  const colors = useMemo(() => {
    if (!product?.variants) return [];
    return product.variants.map((v: any) => ({ id: v._id, color: v.color }));
  }, [product]);

  const images = selectedVariant?.images || [];

  // sizes now comes straight from the selectedVariant (populated by backend as `sizes`)
  const sizeStocks = selectedVariant?.sizes || []; // array of { _id, variantId, size, stock, ... }
  const sizes = (sizeStocks || []).map((s: any) => s.size);

  useEffect(() => {
    // auto-select first size whenever the variant's sizes change
    if (sizeStocks?.length) {
      setSelectedSize(sizeStocks[0].size);
    } else {
      setSelectedSize("");
    }
  }, [selectedVariant, sizeStocks]);

  const price =
    selectedVariant?.salePrice ??
    selectedVariant?.regularPrice ??
    product?.pointsPrice ??
    0;

  const oldPrice = selectedVariant?.salePrice
    ? selectedVariant?.regularPrice
    : undefined;

  const discount =
    oldPrice && price ? Math.round(((oldPrice - price) / oldPrice) * 100) : undefined;

  const handleAddToCart = async ({
    productId,
    price,
    size,
    color,
    qty,
    purchaseMethod,
  }: {
    productId: string;
    price: number;
    size: string;
    color: string;
    qty: number;
    purchaseMethod: "money" | "points";
  }) => {
    try {
      const sizeStock = sizeStocks?.find((s: any) => s.size === size);
      if (!selectedVariant || !sizeStock) {
        toast.error("Please select a valid size");
        return;
      }

      await addToCart({
        productId,
        variantId: selectedVariant._id,
        sizeStockId: sizeStock._id,
        qty,
        purchaseMethod,
      }).unwrap();

      toast.success("Added to cart!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add to cart");
    }
  };

  const handleVariantChange = (variantId: string) => {
    const foundVariant = product?.variants?.find((v: any) => v._id === variantId);
    if (!foundVariant) return;

    setSelectedVariant(foundVariant);
    setSelectedColor(foundVariant.color);
    setSelectedSize(""); // sizes effect will auto-select first size
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <ProductGallery key={selectedVariant?._id} images={images} />
        <ProductInfo
          id={product?._id || ""}
          name={product?.name || ""}
          description={product?.description}
          rating={product?.rating}
          price={price}
          oldPrice={oldPrice}
          discount={discount}
          colors={colors}
          sizes={sizes}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          setSelectedColor={setSelectedColor}
          setSelectedSize={setSelectedSize}
          onAddToCart={handleAddToCart}
          onVariantChange={handleVariantChange}
        />
      </div>

      <div className="mt-12">
        <ProductTabs productId={product?._id || ""} reviews={product?.reviews || []} />
      </div>
      <AlsoLike />
    </div>
  );
};

export default ProductDetailsPage;
