import { apiSlice } from "../api/apiSlice";

export const khaltiApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    initiatePayment: builder.mutation({
      query: (body) => ({
        url: "/khalti/initiate",
        method: "POST",
        body,
      }),
    }),
    verifyPayment: builder.mutation({
      query: ({ token, amount, pidx, paymentId }) => {
        const params = new URLSearchParams({
          token,
          amount,
          pidx,
          paymentId,
        });
        return {
          url: `/khalti/verify?${params.toString()}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useInitiatePaymentMutation, useVerifyPaymentMutation } = khaltiApi;
