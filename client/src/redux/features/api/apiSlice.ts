import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
  phone: string
  address: string
}

export interface AuthResponse {
  success: boolean
  token?: string
  message?: string
  user?: {
    id: string
    fullName: string
    email: string
    password: string
    phone: string
    address: string
    role: string
    loyaltyPoints: number
    referralCode: string
    referredById: string | null
    createdAt: string
    updatedAt: string
  }
}

export interface ApiError {
  message: string
  status: number
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
    credentials: 'include',
  }),
  tagTypes: [
    'Auth',
    'User',
    'Users',
    'Furniture',
    'Rentals',
    'UserAnalytics',
    'RentalAnalytics',
    'FurnitureAnalytics',
    "Referrals"
  ],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login-user',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register-user',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),

    getProfile: builder.query<AuthResponse['user'], void>({
      query: () => '/user/me',
      providesTags: ['User'],
    }),

    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    // Reset Password
    resetPassword: builder.mutation<{ success: boolean; message: string; resetToken?: string }, { email: string }>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),

    // Change Password
    changePassword: builder.mutation<{ success: boolean; message: string }, { oldPassword?: string; newPassword: string; token?: string }>({
      query: (body) => ({
        url: '/auth/change-password',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = apiSlice
