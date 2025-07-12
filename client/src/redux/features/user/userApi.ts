import { apiSlice } from '../api/apiSlice';



export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyRentals: builder.query<any, void>({
      query: () => '/user/rentals',
      transformResponse: (response: any) => response.rentals,
    }),
  })
});

export const {useGetMyRentalsQuery  } = userApi; 