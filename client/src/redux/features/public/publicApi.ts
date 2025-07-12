import { apiSlice } from "../api/apiSlice";

export const publicApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllFurniture: builder.query({
      query: () => "/furnitures",
      providesTags: ["Furniture"]

    }),
    getFurnitureByCategory: builder.query({
      query: (category: string) => `/furnitures/${category}`,
    }),
    getFeaturedProducts: builder.query({
      query: () => `/featuredProducts`,
    }),
    getFurnitureById: builder.query({
      query: (id: string) => `/furniture/${id}`,
    }),
  }),
});

export const {
  useGetAllFurnitureQuery,
  useGetFurnitureByCategoryQuery,
  useGetFeaturedProductsQuery,
  useGetFurnitureByIdQuery
} = publicApi;
