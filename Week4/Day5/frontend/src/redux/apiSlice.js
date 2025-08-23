import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Auth', 'Product', 'Cart', 'User'],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      transformResponse: (response) => {
        // Normalize backend response into { token, user }
        return {
          token: response.data.token,
          user: response.data.user,
        }
      },
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      transformResponse: (response) => {
        return {
          token: response.data.token,
          user: response.data.user,
        }
      },
      invalidatesTags: ['Auth'],
    }),
    profile: builder.query({
      query: () => '/auth/profile',
      transformResponse: (response) => {
        return response.data.user
      },
      providesTags: ['Auth'],
    }),

    // Products
    getProducts: builder.query({
      query: () => '/products',
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map((p) => ({ type: 'Product', id: p._id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),
    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    addProduct: builder.mutation({
      query: (formData) => ({
        url: '/products',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    updateProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    // Cart
    getCart: builder.query({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: '/cart/add',
        method: 'POST',
        body: { productId, quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: '/cart/update',
        method: 'PUT',
        body: { productId, quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/cart/remove/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: `/cart/clear`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),

    // Users (admin/customer management)
    getAdmins: builder.query({
      query: () => '/users/admins',
      providesTags: ['User'],
    }),
    getCustomers: builder.query({
      query: () => '/users/customers',
      providesTags: ['User'],
    }),
    toggleBlockUser: builder.mutation({
      query: ({ id, blocked }) => ({
        url: `/users/${blocked ? 'unblock' : 'block'}/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['User'],
    }),
    setUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/users/role/${id}`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useProfileQuery,
  useGetProductsQuery,
  useGetProductQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useGetAdminsQuery,
  useGetCustomersQuery,
  useToggleBlockUserMutation,
  useSetUserRoleMutation,
} = api
