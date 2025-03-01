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
    login: builder.mutation({
      query: (data) => ({
        url: "login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Me"],
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
  }),
});
export const {
  useLazyGetProductByIdQuery,
  useLoginMutation,
  useGetAllProductsQuery,
} = serviceApi;
