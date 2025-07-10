import { apiSlice } from '../api/apiSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

interface UpdateUserRoleRequest {
  userId: string;
  role: 'USER' | 'ADMIN';
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<User[], void>({
      query: () => '/admin/users',
    }),
    updateUserRole: builder.mutation<User, UpdateUserRoleRequest>({
      query: ({ userId, role }) => ({
        url: `/admin/users/${userId}/role`,
        method: 'PATCH',
        body: { role },
      }),
    }),
  }),
});

export const { useGetAllUsersQuery, useUpdateUserRoleMutation } = userApi; 