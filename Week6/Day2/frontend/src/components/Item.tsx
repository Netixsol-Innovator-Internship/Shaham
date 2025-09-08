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
  originalPrice?: number;
  isOnSale?: boolean;
  discountPercentage?: number;
  qty: number;
  purchaseMethod?: 'money' | 'points' | 'hybrid';
  pointsPrice?: number;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
  onPaymentMethodChange?: (id: string, method: 'money' | 'points') => void;
};

const Item: FC<ItemProps> = ({
  id,
  image,
  name,
  size,
  color,
  price,
  originalPrice,
  isOnSale,
  discountPercentage,
  qty,
  purchaseMethod,
  pointsPrice,
  onIncrease,
  onDecrease,
  onRemove,
  onPaymentMethodChange,
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
              <div className="flex items-center gap-2">
                <p className="font-bold text-purple-600">{pointsPrice || price} pts</p>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Points Only</span>
              </div>
            ) : purchaseMethod === 'hybrid' ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-bold">${price}</p>
                  <p className="text-sm text-purple-600">or {pointsPrice} pts</p>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Flexible Payment</span>
                </div>
                {/* Payment Method Selection for Hybrid Items */}
                {onPaymentMethodChange && (
                  <div className="flex gap-1 mt-2">
                    <button
                      onClick={() => onPaymentMethodChange(id, 'money')}
                      className="px-2 py-1 text-xs rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors"
                    >
                      Use ${price}
                    </button>
                    <button
                      onClick={() => onPaymentMethodChange(id, 'points')}
                      className="px-2 py-1 text-xs rounded-md bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                    >
                      Use {pointsPrice} pts
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {isOnSale && originalPrice ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-red-600">${price}</p>
                    <p className="text-sm text-gray-400 line-through">${originalPrice}</p>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      -{discountPercentage}% OFF
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="font-bold">${price}</p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Money Only</span>
                  </div>
                )}
              </div>
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
