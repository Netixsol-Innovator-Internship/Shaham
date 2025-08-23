"use client"

import { createContext, useContext, useMemo, useCallback } from "react"
import { useSelector } from "react-redux"
import {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} from "../redux/apiSlice"

const CartContext = createContext(null)

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const token = useSelector((s) => s?.auth?.token)

  const { data, isLoading, isFetching, refetch } = useGetCartQuery(undefined, {
    skip: !token,
  })

  const [addToCartMut] = useAddToCartMutation()
  const [updateCartMut] = useUpdateCartItemMutation()
  const [removeFromCartMut] = useRemoveFromCartMutation()
  const [clearCartMut] = useClearCartMutation()

  const addToCart = async (productId, quantity) => {
    await addToCartMut({ productId, quantity }).unwrap()
    refetch()
  }

  const updateQuantity = async (productId, quantity) => {
    await updateCartMut({ productId, quantity }).unwrap()
    refetch()
  }

  const removeFromCart = async (productId) => {
    await removeFromCartMut(productId).unwrap()
    refetch()
  }

  const clearCart = async () => {
    await clearCartMut().unwrap()
    refetch()
  }

  const items = useMemo(() => {
    if (!data) return []

    if (Array.isArray(data)) return data
    if (Array.isArray(data.items)) return data.items
    if (Array.isArray(data.data?.items)) return data.data.items
    if (Array.isArray(data.data?.cart)) return data.data.cart
    if (Array.isArray(data.cart)) return data.cart

    return []
  }, [data])

  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [items]
  )

  const getCartTotal = () =>
    items.reduce(
      (sum, item) =>
        sum + (item.product?.price || 0) * (item.quantity || 0),
      0
    )

  const resetCart = useCallback(() => {
    refetch()
  }, [refetch])

  const value = {
    cartItems: items,
    cartCount,
    loading: isLoading || isFetching,
    getCartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    resetCart,
  }

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  )
}
