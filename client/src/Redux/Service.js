import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "../config";
import { data } from "react-router-dom";
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
  }),
});
export const {
  useLazyGetProductByIdQuery,
  useLoginMutation,
  useMyDetailsQuery,
  useUpdateInfoMutation,
  useRegisterMutation,
  useGetAllProductsQuery,
  useResetPasswordQuery,
  useLogoutMutation,
} = serviceApi;
