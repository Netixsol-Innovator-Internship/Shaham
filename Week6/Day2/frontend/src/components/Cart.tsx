"use client";
import { FC, useState } from "react";
import Item from "./Item";

type CartItem = {
  id: string;
  image: string;
  name: string;
  size: string;
  color: string;
  price: number;
  qty: number;
};

const Cart: FC = () => {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: "1",
      image: "/shirt1.png",
      name: "Gradient Graphic T-shirt",
      size: "Large",
      color: "White",
      price: 145,
      qty: 1,
    },
    {
      id: "2",
      image: "/shirt2.png",
      name: "Checkered Shirt",
      size: "Medium",
      color: "Red",
      price: 180,
      qty: 1,
    },
    {
      id: "3",
      image: "/jeans.png",
      name: "Skinny Fit Jeans",
      size: "Large",
      color: "Blue",
      price: 240,
      qty: 1,
    },
  ]);

  const increaseQty = (id: string) => {
    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
    );
  };

  const decreaseQty = (id: string) => {
    setItems(prev =>
      prev.flatMap(i => {
        if (i.id !== id) return i;
        if (i.qty > 1) return { ...i, qty: i.qty - 1 };
        // if qty = 1 → remove item
        return [];
      })
    );
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm flex-1">
      {items.length === 0 ? (
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
