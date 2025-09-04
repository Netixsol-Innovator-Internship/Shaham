import Cart from "@/components/Cart";
import Order from "@/components/Order";

export default function CartPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        Home &gt; <span className="text-black font-medium">Cart</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-extrabold mb-8">YOUR CART</h1>

      {/* Layout */}
      <div className="flex flex-col md:flex-row gap-8">
        <Cart />
        <Order subtotal={565} discount={113} deliveryFee={15} />
      </div>
    </div>
  );
}
