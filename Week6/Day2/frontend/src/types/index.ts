// User Types
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin' | 'super_admin';
    loyaltyPoints: number;
    verified: boolean;
    blocked: boolean;
    mobile?: string;
    address?: string;
    addresses: Address[];
    orders: string[];
    cart: CartItem[];
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  slug: string;
  images?: string[];
  image?: string;
  description?: string;
  category: "t-shirts" | "shorts" | "shirts" | "hoodie" | "jeans";
  brand?: string;
  style?: "casual" | "formal" | "party" | "gym";
  rating: number;
  isActive: boolean;
  sold: number;
  reviews: any[];
  pointsPrice?: number;
  productType: "regular" | "loyalty-only" | "hybrid";
  isLoyaltyOnly: boolean;
  createdAt: string;
  updatedAt: string;
  variants?: ProductVariant[];
}

export interface ProductVariant {
    _id: string;
    productId: string;
    color: string;
    sku: string;
    images: string[];
    discount?: number;
    regularPrice: number;
    salePrice?: number;
    pointsPrice?: number;
    purchaseMethod: 'money' | 'points' | 'hybrid';
    sizes: SizeStock[];
}

export interface SizeStock {
    _id: string;
    variantId: string;
    size: string;
    stock: number;
}

export interface Review {
    userId: string;
    rating: number;
    comment: string;
    createdAt: Date;
}

// Cart Types
export interface CartItem {
    productId: string;
    variantId: string;
    sizeStockId: string;
    qty: number;
    purchaseMethod: 'money' | 'points' | 'hybrid';
    pointsPrice?: number;
    moneyPrice?: number;
}

export interface Cart {
    _id: string;
    userId: string;
    items: CartItem[];
    createdAt: Date;
    updatedAt: Date;
}

// Order Types
export interface Order {
    _id: string;
    userId: string;
    address: Address;
    items: OrderItem[];
    deliveryFee: number;
    discount: number;
    subtotal: number;
    total: number;
    paymentMethod: string;
    paymentIntentId?: string;
    pointsUsed: number;
    pointsEarned: number;
    completed: boolean;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderItem {
    productId: string;
    variantId: string;
    sizeStockId: string;
    name: string;
    color: string;
    size: string;
    qty: number;
    moneyPrice: number;
    pointsPrice: number;
    purchaseMethod: string;
}

// Sale Types
export interface Sale {
    _id: string;
    title: string;
    description?: string;
    type: 'percentage' | 'fixed';
    discountPercentage: number;
    productIds: string[];
    startAt: string;
    endAt: string;
    active: boolean;
    isScheduled: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

// Notification Types
export interface Notification {
    _id: string;
    userId?: string;
    type: string;
    title: string;
    body?: string;
    payload?: any;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Auth Types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface OTPVerification {
    email: string;
    otp: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
}

// API Response Types
export interface ApiResponse<T> {
    data?: T;
    message: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Filter Types
export interface ProductFilters {
    category?: string;
    style?: string;
    productType?: string;
    minPrice?: number;
    maxPrice?: number;
    color?: string;
    size?: string;
    search?: string;
}

// Socket Events
export interface SocketEvents {
    'notifications:new': Notification;
    'sale:started': Notification;
    'product:sold_out': { productName: string; userId: string };
    'loyalty:points_updated': { userId: string; points: number; type: 'earned' | 'spent' };
}
