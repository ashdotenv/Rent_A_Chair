import { apiSlice } from "../api/apiSlice";

export const rentalApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    placeRental: builder.mutation({
      query: (body) => ({
        url: "/rental/place",
        method: "POST",
        body,
      }),
    }),
    // Add more rental endpoints as needed
  }),
});

export const { usePlaceRentalMutation } = rentalApi;
