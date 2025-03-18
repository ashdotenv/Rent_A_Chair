import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "../config";
export const serviceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_URL,
    credentials: "include",
  }),
  keepUnusedDataFor: 60 * 60 * 24 * 7,
  tagTypes: ["Products", "Me"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Me"],
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Me"],
    }),
    myDetails: builder.query({
      query: () => ({
        url: "user/getmydetails",
        method: "GET",
      }),
    }),
    updateInfo: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/user/update-profile/${userId}`,
        method: "PATCH",
        body: data,
      }),
    }),

    getAllProducts: builder.query({
      query: () => ({
        url: "getAllProducts",
        method: "GET",
      }),
    }),
    getProductById: builder.query({
      query: (id) => ({
        url: `getProductById/${id}`,
        method: "GET",
      }),
    }),

    resetPassword: builder.query({
      query: () => ({
        url: "/user/resetPassword",
        method: "GET",
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
      }),
    }),
    placeOrder: builder.mutation({
      query: (data) => ({
        url: "/user/placeOrder",
        method: "POST",
        body: data,
      }),
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: "/user/getmyorders",
        method: "GET",
      }),
    }),
  }),
});
export const {
  useGetMyOrdersQuery,
  usePlaceOrderMutation,
  useGetProductByIdQuery,
  useLoginMutation,
  useMyDetailsQuery,
  useUpdateInfoMutation,
  useRegisterMutation,
  useGetAllProductsQuery,
  useResetPasswordQuery,
  useLogoutMutation,
} = serviceApi;
