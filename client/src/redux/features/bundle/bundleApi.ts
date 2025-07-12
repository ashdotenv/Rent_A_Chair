import { apiSlice } from "../api/apiSlice";

export const bundleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all bundles
    getAllBundles: builder.query({
      query: () => ({
        url: "/admin/bundles",
        method: "GET",
      }),
    }),

    // Get bundle by ID
    getBundleById: builder.query({
      query: (id: string) => ({
        url: `/admin/bundles/${id}`,
        method: "GET",
      }),
    }),

    // Create bundle
    createBundle: builder.mutation({
      query: (body) => ({
        url: "/admin/bundles",
        method: "POST",
        body,
      }),
    }),

    // Update bundle
    updateBundle: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/bundles/${id}`,
        method: "PUT",
        body,
      }),
    }),

    // Delete bundle
    deleteBundle: builder.mutation({
      query: (id: string) => ({
        url: `/admin/bundles/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllBundlesQuery,
  useGetBundleByIdQuery,
  useCreateBundleMutation,
  useUpdateBundleMutation,
  useDeleteBundleMutation,
} = bundleApi; 