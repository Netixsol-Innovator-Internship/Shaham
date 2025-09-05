"use client";
import { FC, useMemo } from "react";
import Item from "./Item";
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveFromCartMutation } from "@/lib/api";

const Cart: FC = () => {
  const { data } = useGetCartQuery();
  const [updateCart] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const items = useMemo(() => {
    const list = data?.items || [];
    return list.map((it: any) => ({
      id: `${it.productId}:${it.variantId}:${it.sizeStockId}:${it.purchaseMethod}`,
      image: it.image || "/shirt.png",
      name: it.name || "Product",
      size: it.size || "",
      color: it.color || "",
      price: it.moneyPrice || it.pointsPrice || 0,
      qty: it.qty || 1,
      raw: it,
    }));
  }, [data]);

  const increaseQty = async (id: string) => {
    const it = items.find(i => i.id === id)?.raw;
    if (!it) return;
    await updateCart({ productId: it.productId, body: { variantId: it.variantId, sizeStockId: it.sizeStockId, purchaseMethod: it.purchaseMethod, qty: (it.qty || 1) + 1 } });
  };

  const decreaseQty = async (id: string) => {
    const it = items.find(i => i.id === id)?.raw;
    if (!it) return;
    const next = (it.qty || 1) - 1;
    if (next <= 0) {
      await removeItem(id);
    } else {
      await updateCart({ productId: it.productId, body: { variantId: it.variantId, sizeStockId: it.sizeStockId, purchaseMethod: it.purchaseMethod, qty: next } });
    }
  };

  const removeItem = async (id: string) => {
    const it = items.find(i => i.id === id)?.raw;
    if (!it) return;
    await removeFromCart({ productId: it.productId, body: { variantId: it.variantId, sizeStockId: it.sizeStockId, purchaseMethod: it.purchaseMethod } });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm flex-1">
      {!items.length ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        items.map(item => (
          <Item
            key={item.id}
            {...item}
            onIncrease={increaseQty}
            onDecrease={decreaseQty}
            onRemove={removeItem}
          />
        ))
      )}
    </div>
  );
};

export default Cart;
