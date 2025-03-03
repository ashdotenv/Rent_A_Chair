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
    adminlogin: builder.mutation({
      query: (data) => ({
        url: "adminlogin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Me"],
    }),

    updateProduct: builder.mutation({
      query: ({ productId, data }) => ({
        url: `/admin/update-product/${productId}`,
        body: data,
        method: "PATCH",
      }),
    }),
    addProduct: builder.mutation({
      query: (body) => ({
        url: "/admin/add-product",
        body: body,
        method: "POST",
      }),
    }),
    getAllCategories: builder.query({
      query: () => ({
        url: "/admin/getAllCategories",
        method: "GET",
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/admin/delete-product/${productId}`,
        method: "DELETE",
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
  }),
});
export const {
  useLazyGetProductByIdQuery,
  useAdminloginMutation,
  useGetAllProductsQuery,
  useUpdateProductMutation,
  useAddProductMutation,
  useGetAllCategoriesQuery,
  useDeleteProductMutation,
} = serviceApi;
