import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || '/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken');
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Car', 'Booking', 'Review', 'Notification', 'Wishlist', 'User', 'Conversation', 'Message'],
  endpoints: (builder) => ({
    getCars: builder.query({ query: (params) => ({ url: '/cars', params }), providesTags: ['Car'] }),
    getCar: builder.query({ query: (id) => `/cars/${id}`, providesTags: (r, e, id) => [{ type: 'Car', id }] }),
    getFeaturedCars: builder.query({ query: () => '/cars/featured', providesTags: ['Car'] }),
    getPopularCars: builder.query({ query: () => '/cars/popular', providesTags: ['Car'] }),
    getMyBookings: builder.query({ query: () => '/bookings/my-bookings', providesTags: ['Booking'] }),
    createBooking: builder.mutation({ query: (body) => ({ url: '/bookings', method: 'POST', body }), invalidatesTags: ['Booking', 'Car'] }),
    updateBookingStatus: builder.mutation({ query: ({ id, ...body }) => ({ url: `/bookings/${id}/status`, method: 'PUT', body }), invalidatesTags: ['Booking'] }),
    getReviews: builder.query({ query: (carId) => `/reviews/car/${carId}`, providesTags: ['Review'] }),
    createReview: builder.mutation({ query: (body) => ({ url: '/reviews', method: 'POST', body }), invalidatesTags: ['Review', 'Car'] }),
    getNotifications: builder.query({ query: (params) => ({ url: '/notifications', params }), providesTags: ['Notification'] }),
    markAllRead: builder.mutation({ query: () => ({ url: '/notifications/mark-all-read', method: 'PUT' }), invalidatesTags: ['Notification'] }),
    markNotificationRead: builder.mutation({ query: (id) => ({ url: `/notifications/${id}/read`, method: 'PUT' }), invalidatesTags: ['Notification'] }),
    getWishlist: builder.query({ query: () => '/wishlist', providesTags: ['Wishlist'] }),
    addToWishlist: builder.mutation({ query: (carId) => ({ url: `/wishlist/${carId}`, method: 'POST' }), invalidatesTags: ['Wishlist'] }),
    removeFromWishlist: builder.mutation({ query: (carId) => ({ url: `/wishlist/${carId}`, method: 'DELETE' }), invalidatesTags: ['Wishlist'] }),
    getConversations: builder.query({ query: () => '/messages/conversations', providesTags: ['Conversation'] }),
    getOrCreateConversation: builder.mutation({ query: (body) => ({ url: '/messages/conversations', method: 'POST', body }), invalidatesTags: ['Conversation'] }),
    getMessages: builder.query({ query: (conversationId) => `/messages/conversations/${conversationId}`, providesTags: (r, e, id) => [{ type: 'Message', id }] }),
    sendMessage: builder.mutation({ query: (body) => ({ url: '/messages', method: 'POST', body }), invalidatesTags: (r, e, arg) => [{ type: 'Message', id: arg.conversationId }, 'Conversation'] }),
  }),
});

export const {
  useGetCarsQuery, useGetCarQuery, useGetFeaturedCarsQuery, useGetPopularCarsQuery,
  useGetMyBookingsQuery, useCreateBookingMutation, useUpdateBookingStatusMutation,
  useGetReviewsQuery, useCreateReviewMutation,
  useGetNotificationsQuery, useMarkAllReadMutation, useMarkNotificationReadMutation,
  useGetWishlistQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation,
  useGetConversationsQuery, useGetOrCreateConversationMutation, useGetMessagesQuery, useSendMessageMutation,
} = apiSlice;
