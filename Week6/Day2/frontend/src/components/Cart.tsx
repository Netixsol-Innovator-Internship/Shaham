"use client";
import { FC, useMemo } from "react";
import Item from "./Item";
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveFromCartMutation, useGetCurrentSaleQuery } from "@/lib/api";
import { calculateSalePrice } from "@/lib/saleUtils";
import toast from "react-hot-toast";

const Cart: FC = () => {
  const { data, isLoading, isError, error } = useGetCartQuery();
  const { data: currentSale } = useGetCurrentSaleQuery();
  
  // Debug authentication
  console.log("Cart query state:", { data, isLoading, isError, error });
  console.log("Token in localStorage:", typeof window !== 'undefined' && localStorage.getItem('token') ? 'Present' : 'Missing');
  const [updateCart] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const items = useMemo(() => {
    console.log("Cart data received:", data);
    const list = data?.items || [];
    console.log("Cart items:", list);
    return list.map((it: any) => {
      // Calculate sale pricing for money purchases
      const regularPrice = it.moneyPrice || 0;
      const pricing = calculateSalePrice(regularPrice, it.productId, currentSale);
      
      return {
        id: `${it.productId}:${it.variantId}:${it.sizeStockId}:${it.purchaseMethod}`,
        image: it.image || "/shirt.png",
        name: it.name || "Product",
        size: it.size || "",
        color: it.color || "",
        price: it.purchaseMethod === 'money' ? pricing.salePrice : (it.pointsPrice || 0),
        originalPrice: it.purchaseMethod === 'money' && pricing.isOnSale ? pricing.originalPrice : undefined,
        isOnSale: it.purchaseMethod === 'money' ? pricing.isOnSale : false,
        discountPercentage: it.purchaseMethod === 'money' ? pricing.discountPercentage : undefined,
        qty: it.qty || 1,
        purchaseMethod: it.purchaseMethod,
        pointsPrice: it.pointsPrice,
        raw: it,
      };
    });
  }, [data, currentSale]);

  const increaseQty = async (id: string) => {
    const it = items.find(i => i.id === id)?.raw;
    if (!it) return;
    
    console.log("Increasing quantity for item:", it);
    console.log("API call payload:", {
      productId: it.productId,
      body: {
        variantId: it.variantId,
        sizeStockId: it.sizeStockId,
        purchaseMethod: it.purchaseMethod,
        qty: (it.qty || 1) + 1
      }
    });
    
    try {
      const result = await updateCart({ 
        productId: it.productId, 
        body: { 
          variantId: it.variantId, 
          sizeStockId: it.sizeStockId, 
          purchaseMethod: it.purchaseMethod, 
          qty: (it.qty || 1) + 1 
        } 
      }).unwrap();
      console.log("Update cart result:", result);
      toast.success("Quantity updated");
    } catch (error: any) {
      console.error("Update cart error:", error);
      toast.error(error?.data?.message || "Failed to update quantity");
    }
  };

  const decreaseQty = async (id: string) => {
    const it = items.find(i => i.id === id)?.raw;
    if (!it) return;
    const next = (it.qty || 1) - 1;
    
    console.log("Decreasing quantity for item:", it, "new qty:", next);
    
    if (next <= 0) {
      await removeItem(id);
    } else {
      try {
        const result = await updateCart({ 
          productId: it.productId, 
          body: { 
            variantId: it.variantId, 
            sizeStockId: it.sizeStockId, 
            purchaseMethod: it.purchaseMethod, 
            qty: next 
          } 
        }).unwrap();
        console.log("Decrease cart result:", result);
        toast.success("Quantity updated");
      } catch (error: any) {
        console.error("Decrease cart error:", error);
        toast.error(error?.data?.message || "Failed to update quantity");
      }
    }
  };

  const removeItem = async (id: string) => {
    const it = items.find(i => i.id === id)?.raw;
    if (!it) return;
    
    try {
      await removeFromCart({ 
        productId: it.productId, 
        body: { 
          variantId: it.variantId, 
          sizeStockId: it.sizeStockId, 
          purchaseMethod: it.purchaseMethod 
        } 
      }).unwrap();
      toast.success("Item removed from cart");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to remove item");
    }
  };

  const handlePaymentMethodChange = async (id: string, newMethod: 'money' | 'points') => {
    const it = items.find(i => i.id === id)?.raw;
    if (!it) return;
    
    console.log("Changing payment method for item:", it, "to:", newMethod);
    
    try {
      // Remove the old item
      await removeFromCart({ 
        productId: it.productId, 
        body: { 
          variantId: it.variantId, 
          sizeStockId: it.sizeStockId, 
          purchaseMethod: it.purchaseMethod 
        } 
      }).unwrap();
      
      // Add the item with new payment method
      await updateCart({ 
        productId: it.productId, 
        body: { 
          variantId: it.variantId, 
          sizeStockId: it.sizeStockId, 
          purchaseMethod: newMethod, 
          qty: it.qty 
        } 
      }).unwrap();
      
      toast.success(`Payment method changed to ${newMethod === 'money' ? 'money' : 'points'}`);
    } catch (error: any) {
      console.error("Payment method change error:", error);
      toast.error(error?.data?.message || "Failed to change payment method");
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm flex-1">
      {isLoading && (
        <div className="text-center text-gray-500 py-8">Loading cart...</div>
      )}
      {isError && (
        <div className="text-center text-red-500 py-8">
          Failed to load products. Error: {'status' in error ? error.status : "Unknown error"}
          <br />
          <small>Check console for details</small>
        </div>
      )}
      {!isLoading && !isError && !items.length ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        !isLoading && !isError && items.map(item => (
          <Item
            key={item.id}
            {...item}
            onIncrease={increaseQty}
            onDecrease={decreaseQty}
            onRemove={removeItem}
            onPaymentMethodChange={handlePaymentMethodChange}
          />
        ))
      )}
    </div>
  );
};

export default Cart;
