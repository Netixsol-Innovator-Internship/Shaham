
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }: any) => {
      const token = (getState().auth?.token) as string | undefined
      console.log("STATE", getState());
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    }
  }),
  tagTypes: ['Me','Cars','Car','Bids','Wishlist','Notifications'],
  endpoints: (builder) => ({
    // Auth
    register: builder.mutation<{token:string}, any>({
      query: (body) => ({ url: 'auth/register', method: 'POST', body })
    }),
    login: builder.mutation<{token:string}, any>({
      query: (body) => ({ url: 'auth/login', method: 'POST', body })
    }),
    me: builder.query<any, void>({ query: () => 'users/me', providesTags: ['Me'] }),
    updateMe: builder.mutation<any, Partial<any>>({
      query: (body) => ({ url: 'users/me', method: 'PATCH', body }),
      invalidatesTags: ['Me']
    }),

    // Cars & auctions
    listCars: builder.query<any[], {make?:string, model?:string, type?:string, minPrice?:number, maxPrice?:number}>({
      query: (q) => ({ url: 'cars', params: q }),
      providesTags: ['Cars']
    }),
    myCars: builder.query<any[], void>({
      query: () => 'cars/me',
      providesTags: ['Cars']
    }),
    getCar: builder.query<any, string>({ query: (id) => `cars/${id}`, providesTags: (_r,_e,id)=>[{type:'Car',id}] }),
    listActiveAuctions: builder.query<any[], void>({ query: ()=> 'cars/auctions', providesTags: ['Cars'] }),
    createCar: builder.mutation<any, any>({
      query: (body) => ({ url: 'cars', method: 'POST', body }),
      invalidatesTags: ['Cars']
    }),
    startAuction: builder.mutation<any, string>({ // carId
      query: (id) => ({ url: `cars/${id}/start`, method: 'PATCH' }),
      invalidatesTags: ['Cars', 'Car']
    }),
    endAuction: builder.mutation<any, string>({
      query: (id) => ({ url: `cars/${id}/end`, method: 'PATCH' }),
      invalidatesTags: ['Cars','Car']
    }),
    updateCar: builder.mutation<any, {id:string, body:any}>({
      query: ({id, body}) => ({ url: `cars/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Cars','Car']
    }),
    deleteCar: builder.mutation<any, string>({
      query: (id) => ({ url: `cars/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Cars']
    }),

    // Bids
    listBids: builder.query<any[], string>({ query: (carId)=> `cars/${carId}/bids`, providesTags: ['Bids'] }),
    placeBid: builder.mutation<any, {carId:string, amount:number}>({
      query: ({carId, amount}) => ({ url: `bids/${carId}`, method: 'POST', body: { amount } }),
      invalidatesTags: ['Bids','Cars','Car']
    }),

    myBids: builder.query<any[], void>({
      query: () => 'bids/me',
      providesTags: ['Bids']
    }),

    // Wishlist
    myWishlist: builder.query<any[], void>({ query: ()=> 'users/wishlist/me', providesTags: ['Wishlist'] }),
    addToWishlist: builder.mutation<any, string>({
      query: (carId)=> ({ url: `users/wishlist/${carId}`, method: 'PATCH' }),
      invalidatesTags: ['Wishlist']
    }),
    removeFromWishlist: builder.mutation<any, string>({
      query: (carId)=> ({ url: `users/wishlist/${carId}`, method: 'DELETE' }),
      invalidatesTags: ['Wishlist']
    }),

    // Notifications
    listNotifications: builder.query<any[], void>({ query: ()=> 'notifications', providesTags: ['Notifications'] }),
    markNotification: builder.mutation<any, string>({
      query: (id)=> ({ url: `notifications/${id}/read`, method: 'PATCH' }),
      invalidatesTags: ['Notifications']
    }),
  })
})

export const {
  useRegisterMutation, useLoginMutation, useMeQuery, useUpdateMeMutation,
  useListCarsQuery, useGetCarQuery, useListActiveAuctionsQuery, useCreateCarMutation, useStartAuctionMutation, useEndAuctionMutation, useUpdateCarMutation, useDeleteCarMutation,
  useListBidsQuery, usePlaceBidMutation,
  useMyWishlistQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation,
  useListNotificationsQuery, useMarkNotificationMutation,useMyCarsQuery,useMyBidsQuery
} = api
