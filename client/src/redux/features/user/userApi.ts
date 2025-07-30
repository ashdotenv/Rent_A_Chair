import { apiSlice } from '../api/apiSlice';



export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyRentals: builder.query<any, void>({
      query: () => '/user/rentals',
      transformResponse: (response: any) => response.rentals,
    }),
    getMyLoyaltyPoints: builder.query<any, void>({
      query: () => '/user/loyalty-points',
      transformResponse: (response: any) => response.rentals,
    }),
    getMyReferralHistory: builder.query<any, void>({
      query: () => "/user/referral-history",
      providesTags: ["Referrals"]
    }),
    getUserDashboard: builder.query<any, void>({
      query: () => ({
        url: "/user/dashboard"
      })
    }),
    updateProfile: builder.mutation<any, { fullName: string } | any>({
      query: (body) => ({
        url: '/user/update-Profile',
        method: 'PUT',
        body,
      }),
    }),
    generateReferralCode: builder.mutation<any, { fullName: string } | any>({
      query: (body) => ({
        url: '/user/genrate-referral-code',
        method: 'POST',
        body,
      }),
      invalidatesTags: ["Referrals"]
    }),
  })
});

export const { useGetMyRentalsQuery, useGetMyReferralHistoryQuery, useGenerateReferralCodeMutation, useGetMyLoyaltyPointsQuery, useUpdateProfileMutation, useGetUserDashboardQuery } = userApi; 