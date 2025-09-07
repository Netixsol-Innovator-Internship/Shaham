"use client";
import { FC } from "react";
import { Trash2 } from "lucide-react";

type ItemProps = {
  id: string;
  image: string;
  name: string;
  size: string;
  color: string;
  price: number;
  qty: number;
  purchaseMethod?: 'money' | 'points' | 'hybrid';
  pointsPrice?: number;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
};

const Item: FC<ItemProps> = ({
  id,
  image,
  name,
  size,
  color,
  price,
  qty,
  purchaseMethod,
  pointsPrice,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  return (
    <div className="flex items-center justify-between border-b py-4">
      {/* Product Info */}
      <div className="flex items-center gap-4">
        <img src={image} alt={name} className="w-20 h-20 rounded-lg object-cover" />
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-gray-600">Size: {size}</p>
          <p className="text-sm text-gray-600">Color: {color}</p>
          <div className="mt-1">
            {purchaseMethod === 'points' ? (
              <p className="font-bold text-blue-600">{pointsPrice || price} Points</p>
            ) : purchaseMethod === 'hybrid' ? (
              <div>
                <p className="font-bold">${price}</p>
                <p className="text-sm text-blue-600">or {pointsPrice} Points</p>
              </div>
            ) : (
              <p className="font-bold">${price}</p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button onClick={() => onRemove(id)} className="text-red-500 hover:text-red-600">
          <Trash2 size={20} />
        </button>
        <div className="flex items-center bg-gray-100 rounded-full px-2">
          <button onClick={() => onDecrease(id)} className="px-2 text-lg font-bold">−</button>
          <span className="px-2">{qty}</span>
          <button onClick={() => onIncrease(id)} className="px-2 text-lg font-bold">+</button>
        </div>
      </div>
    </div>
  );
};

export default Item;
