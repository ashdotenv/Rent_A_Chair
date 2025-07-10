import { apiSlice } from "../api/apiSlice"

export const adminApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getAllUsers: builder.query({
      query: () => "/admin/users",
      providesTags: ["Users"]
    }),
    addFurniture: builder.mutation({
      query: (body) => ({
        url: "/admin/add-furniture",
        method: "POST",
        body
      }),
      invalidatesTags: ["Furniture"]
    }),
    updateFurniture: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/update-furniture/${id}`,
        method: "PUT",
        body
      }),
      invalidatesTags: ["Furniture"]
    }),
    deleteFurniture: builder.mutation({
      query: (id) => ({
        url: `/admin/delete-furniture/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Furniture"]
    }),
    updateUserRole: builder.mutation({
      query: (body) => ({
        url: "/admin/update-user-role",
        method: "PUT",
        body
      }),
      invalidatesTags: ["Users"]
    }),
    updateRentalStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/update-rental-status/${id}`,
        method: "PUT",
        body: { status }
      }),
      invalidatesTags: ["Rentals"]
    }),
    getUserAnalytics: builder.query({
      query: () => "/admin/analytics/users",
      providesTags: ["UserAnalytics"]
    }),
    getRentalAnalytics: builder.query({
      query: () => "/admin/analytics/rentals",
      providesTags: ["RentalAnalytics"]
    }),
    getFurnitureAnalytics: builder.query({
      query: () => "/admin/analytics/furniture",
      providesTags: ["FurnitureAnalytics"]
    }),
    getAllRentals: builder.query({
      query: () => "/admin/rentals",
      providesTags: ["Rentals"],
    })
  })
})

export const {
  useGetAllUsersQuery,
  useAddFurnitureMutation,
  useUpdateFurnitureMutation,
  useDeleteFurnitureMutation,
  useUpdateUserRoleMutation,
  useUpdateRentalStatusMutation,
  useGetUserAnalyticsQuery,
  useGetRentalAnalyticsQuery,
  useGetFurnitureAnalyticsQuery,
  useGetAllRentalsQuery
} = adminApi
