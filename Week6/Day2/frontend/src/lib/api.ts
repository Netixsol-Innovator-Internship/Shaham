import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
    Product,
    Cart,
    Order,
    Sale,
    Notification,
    User,
    LoginCredentials,
    RegisterData,
    OTPVerification,
    AuthResponse,
    ProductFilters
} from '@/types';

// Debug: log the API base URL
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
console.log('API Base URL:', baseUrl);

// Define the base API
export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers, { getState }) => {
            // Get token from localStorage or state
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Product', 'Cart', 'Order', 'User', 'Sale', 'Notification'],
    endpoints: (builder) => ({
        // Auth endpoints
        register: builder.mutation<{ message: string }, RegisterData>({
            query: (credentials) => ({
                url: '/auth/register',
                method: 'POST',
                body: credentials,
            }),
        }),

        verifyOTP: builder.mutation<{ message: string }, OTPVerification>({
            query: (data) => ({
                url: '/auth/verify-otp',
                method: 'POST',
                body: data,
            }),
        }),

        resendOTP: builder.mutation<{ message: string }, { email: string }>({
            query: (data) => ({
                url: '/auth/resend-otp',
                method: 'POST',
                body: data,
            }),
        }),

        login: builder.mutation<AuthResponse, LoginCredentials>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),

        // Product endpoints
        getProducts: builder.query<Product[], ProductFilters>({
            query: (filters) => {
                console.log('getProducts called with filters:', filters);

                // Filter out empty/undefined values
                const cleanFilters: any = {};
                if (filters) {
                    Object.entries(filters).forEach(([key, value]) => {
                        if (value !== undefined && value !== null && value !== '') {
                            cleanFilters[key] = value;
                        }
                    });
                }

                console.log('Clean filters being sent:', cleanFilters);

                return {
                    url: '/products',
                    params: Object.keys(cleanFilters).length > 0 ? cleanFilters : undefined,
                };
            },
            providesTags: ['Product'],
        }),

        getProduct: builder.query<Product, string>({
            query: (id) => `/products/${id}`,
            providesTags: (result, error, id) => [{ type: 'Product', id }],
        }),

        getLoyaltyProducts: builder.query<Product[], void>({
            query: () => '/products?productType=loyalty-only',
            providesTags: ['Product'],
        }),

        getHybridProducts: builder.query<Product[], void>({
            query: () => '/products?productType=hybrid',
            providesTags: ['Product'],
        }),

        // Cart endpoints
        getCart: builder.query<Cart, void>({
            query: () => '/cart',
            providesTags: ['Cart'],
        }),

        addToCart: builder.mutation<Cart, any>({
            query: (item) => ({
                url: '/cart/add',
                method: 'POST',
                body: item,
            }),
            invalidatesTags: ['Cart'],
        }),

        updateCartItem: builder.mutation<Cart, { productId: string; body: any }>({
            query: ({ productId, body }) => ({
                url: `/cart/update/${productId}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Cart'],
        }),

        removeFromCart: builder.mutation<Cart, { productId: string; body: any }>({
            query: ({ productId, body }) => ({
                url: `/cart/remove/${productId}`,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['Cart'],
        }),

        // Order endpoints
        createPaymentIntent: builder.mutation<any, { amount: number }>({
            query: (data) => ({
                url: '/orders/create-payment-intent',
                method: 'POST',
                body: data,
            }),
        }),

        checkout: builder.mutation<Order, any>({
            query: (data) => ({
                url: '/orders/checkout',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Cart', 'Order', 'User'],
        }),

        getOrders: builder.query<Order[], void>({
            query: () => '/orders',
            providesTags: ['Order'],
        }),

        getOrder: builder.query<Order, string>({
            query: (id) => `/orders/${id}`,
            providesTags: (result, error, id) => [{ type: 'Order', id }],
        }),

        // User endpoints
        getProfile: builder.query<User, void>({
            query: () => '/users/me',
            providesTags: ['User'],
        }),

        // Sale endpoints
        getSales: builder.query<Sale[], void>({
            query: () => '/admin/sales/list',
            providesTags: ['Sale'],
        }),

        // Notification endpoints
        getNotifications: builder.query<Notification[], void>({
            query: () => '/notifications',
            providesTags: ['Notification'],
        }),

        markNotificationRead: builder.mutation<Notification, string>({
            query: (id) => ({
                url: `/notifications/mark-read/${id}`,
                method: 'POST',
            }),
            invalidatesTags: ['Notification'],
        }),

        // Size endpoints
        getVariantSizes: builder.query<any[], string>({
            query: (variantId) => `/sizes/variant/${variantId}`,
            providesTags: (result, error, variantId) => [{ type: 'Product', id: variantId }],
        }),
    }),
});

// Export hooks for usage in components
export const {
    // Auth
    useRegisterMutation,
    useVerifyOTPMutation,
    useResendOTPMutation,
    useLoginMutation,

    // Products
    useGetProductsQuery,
    useGetProductQuery,
    useGetLoyaltyProductsQuery,
    useGetHybridProductsQuery,

    // Cart
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateCartItemMutation,
    useRemoveFromCartMutation,

    // Orders
    useCreatePaymentIntentMutation,
    useCheckoutMutation,
    useGetOrdersQuery,
    useGetOrderQuery,

    // User
    useGetProfileQuery,

    // Sales
    useGetSalesQuery,

    // Notifications
    useGetNotificationsQuery,
    useMarkNotificationReadMutation,

    // Sizes
    useGetVariantSizesQuery,
} = api;
