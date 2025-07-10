import { apiSlice } from "../api/apiSlice";

export const publicApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllFurniture: builder.query({
      query: () => "/furnitures",
    }),
    getFurnitureByCategory: builder.query({
      query: (category: string) => `/furnitures/${category}`,
    }),
    getFeaturedProducts: builder.query({
      query: (category: string) => `/featuredProducts`,
    }),
    // Add more public endpoints as needed
  }),
});

export const {
  useGetAllFurnitureQuery,
  useGetFurnitureByCategoryQuery,
  useGetFeaturedProductsQuery
} = publicApi;
