"use client"
import Loader from '@/components/Loader';
import { useGetAllUsersQuery, useUpdateUserRoleMutation } from '@/redux/features/admin/adminApi';
import { useState } from 'react';
// You may need to adjust the import path based on your RTK Query structure

export default function AdminUsersPage() {
  const { data, isLoading, isError } = useGetAllUsersQuery(undefined);
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [roleUpdates, setRoleUpdates] = useState({});

  if (isLoading) return <div className='flex h-screen items-center justify-center' ><Loader />;</div>
  if (isError) return <div>Failed to load users.</div>;

  const handleRoleChange = (userId: string, newRole: string) => {
    setRoleUpdates((prev) => ({ ...prev, [userId]: newRole }));
    updateUserRole({ userId, role: newRole });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Role</th>
            <th className="py-2 px-4 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.users?.map((user: any) => (
            <tr key={user.id} className="border-b">
              <td className="py-2 px-4 border">{user.id}</td>
              <td className="py-2 px-4 border">{user.name}</td>
              <td className="py-2 px-4 border">{user.email}</td>
              <td className="py-2 px-4 border">{user.role}</td>
              <td className="py-2 px-4 border">
                <select
                  value={roleUpdates[user.id] || user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 