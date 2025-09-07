import type { Sale } from '@/types';

export interface ProductPricing {
  originalPrice: number;
  salePrice: number;
  discountPercentage: number;
  isOnSale: boolean;
}

/**
 * Calculate the sale price for a product given the current active sale
 */
export function calculateSalePrice(
  originalPrice: number,
  productId: string,
  currentSale: Sale | null | undefined
): ProductPricing {
  // Default pricing (no sale)
  const defaultPricing: ProductPricing = {
    originalPrice,
    salePrice: originalPrice,
    discountPercentage: 0,
    isOnSale: false,
  };

  // Return default if no active sale
  if (!currentSale || !currentSale.active) {
    return defaultPricing;
  }

  // Check if sale has ended
  const now = new Date();
  const endDate = new Date(currentSale.endAt);
  if (now > endDate) {
    return defaultPricing;
  }

  // Check if product is included in sale
  // If productIds is empty, sale applies to all products
  const isProductIncluded = currentSale.productIds.length === 0 || 
                           currentSale.productIds.includes(productId);

  if (!isProductIncluded) {
    return defaultPricing;
  }

  // Calculate sale price
  const discountAmount = (originalPrice * currentSale.discountPercentage) / 100;
  const salePrice = originalPrice - discountAmount;

  return {
    originalPrice,
    salePrice: Math.max(salePrice, 0), // Ensure price doesn't go negative
    discountPercentage: currentSale.discountPercentage,
    isOnSale: true,
  };
}

/**
 * Format currency with proper symbol
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Calculate savings amount
 */
export function calculateSavings(originalPrice: number, salePrice: number): number {
  return originalPrice - salePrice;
}
