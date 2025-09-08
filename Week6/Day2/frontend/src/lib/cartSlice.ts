import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Product } from '@/types';

interface CartState {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    totalPoints: number;
    isLoading: boolean;
}

const initialState: CartState = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    totalPoints: 0,
    isLoading: false,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart: (state, action: PayloadAction<{ items: CartItem[] }>) => {
            state.items = action.payload.items;
            state.totalItems = action.payload.items.reduce((sum, item) => sum + item.qty, 0);
            // Note: Total price and points will be calculated in components
        },

        addItem: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find(
                item =>
                    item.productId === action.payload.productId &&
                    item.variantId === action.payload.variantId &&
                    item.sizeStockId === action.payload.sizeStockId &&
                    item.purchaseMethod === action.payload.purchaseMethod
            );

            if (existingItem) {
                existingItem.qty += action.payload.qty;
            } else {
                state.items.push(action.payload);
            }

            state.totalItems = state.items.reduce((sum, item) => sum + item.qty, 0);
        },

        updateItemQuantity: (state, action: PayloadAction<{
            productId: string;
            variantId: string;
            sizeStockId: string;
            purchaseMethod: string;
            qty: number;
        }>) => {
            const { productId, variantId, sizeStockId, purchaseMethod, qty } = action.payload;
            const item = state.items.find(
                item =>
                    item.productId === productId &&
                    item.variantId === variantId &&
                    item.sizeStockId === sizeStockId &&
                    item.purchaseMethod === purchaseMethod
            );

            if (item) {
                item.qty = qty;
                if (qty <= 0) {
                    state.items = state.items.filter(
                        item =>
                            !(item.productId === productId &&
                                item.variantId === variantId &&
                                item.sizeStockId === sizeStockId &&
                                item.purchaseMethod === purchaseMethod)
                    );
                }
                state.totalItems = state.items.reduce((sum, item) => sum + item.qty, 0);
            }
        },

        removeItem: (state, action: PayloadAction<{
            productId: string;
            variantId: string;
            sizeStockId: string;
            purchaseMethod: string;
        }>) => {
            const { productId, variantId, sizeStockId, purchaseMethod } = action.payload;
            state.items = state.items.filter(
                item =>
                    !(item.productId === productId &&
                        item.variantId === variantId &&
                        item.sizeStockId === sizeStockId &&
                        item.purchaseMethod === purchaseMethod)
            );
            state.totalItems = state.items.reduce((sum, item) => sum + item.qty, 0);
        },

        clearCart: (state) => {
            state.items = [];
            state.totalItems = 0;
            state.totalPrice = 0;
            state.totalPoints = 0;
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        calculateTotals: (state, action: PayloadAction<Product[]>) => {
            let totalPrice = 0;
            let totalPoints = 0;

            state.items.forEach(cartItem => {
                const product = action.payload.find(p => p._id === cartItem.productId);
                if (product) {
                    const variant = product.variants?.find(v => v._id === cartItem.variantId);
                    if (variant) {
                        if (cartItem.purchaseMethod === 'points') {
                            totalPoints += (variant.pointsPrice || 0) * cartItem.qty;
                        } else {
                            const price = variant.salePrice || variant.regularPrice;
                            totalPrice += price * cartItem.qty;
                        }
                    }
                }
            });

            state.totalPrice = totalPrice;
            state.totalPoints = totalPoints;
        },
    },
});

export const {
    setCart,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    setLoading,
    calculateTotals,
} = cartSlice.actions;

export default cartSlice.reducer;
