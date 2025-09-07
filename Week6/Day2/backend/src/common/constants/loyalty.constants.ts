export const LOYALTY_CONSTANTS = {
  // 1 point = $5 as specified
  POINT_TO_DOLLAR_RATIO: 5,
  
  // 10 points earned per $50 spent
  POINTS_EARNED_PER_DOLLAR: 10 / 50, // 0.2 points per dollar
  
  // Minimum spend to earn points
  MIN_SPEND_FOR_POINTS: 50,
  
  // Points earned per $50 spent
  POINTS_PER_SPEND_THRESHOLD: 10,
  SPEND_THRESHOLD: 50,
};

export const PURCHASE_METHODS = {
  MONEY: 'money',
  POINTS: 'points', 
  HYBRID: 'hybrid',
} as const;

export type PurchaseMethod = typeof PURCHASE_METHODS[keyof typeof PURCHASE_METHODS];
