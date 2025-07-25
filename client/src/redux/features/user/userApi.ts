import { apiSlice } from '../api/apiSlice';



export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyRentals: builder.query<any, void>({
      query: () => '/user/rentals',
      transformResponse: (response: any) => response.rentals,
    }),
    updateProfile: builder.mutation<any, { fullName: string } | any>({
      query: (body) => ({
        url: '/user/update-Profile',
        method: 'PUT',
        body,
      }),
    }),
  })
});

export const {useGetMyRentalsQuery, useUpdateProfileMutation} = userApi; 