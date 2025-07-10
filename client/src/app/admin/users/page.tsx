"use client";
import React, { useState } from "react";
import Loader from "@/components/Loader";
import { useGetAllUsersQuery, useUpdateUserRoleMutation } from "@/redux/features/admin/adminApi";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

function getErrorMessage(error: any) {
  if (!error) return "Unknown error";
  if (typeof error === "string") return error;
  if (error.data && typeof error.data === "string") return error.data;
  if (error.message) return error.message;
  if (error.error) return error.error;
  return JSON.stringify(error);
}

const ROLES = ["ADMIN", "USER"];

export default function AdminUsersPage() {
  const { data, isLoading, isError, error, refetch } = useGetAllUsersQuery(undefined);
  const [updateUserRole, { isLoading: isUpdating, isSuccess, reset }] = useUpdateUserRoleMutation();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-600 text-center mt-8">
        Error loading users: {getErrorMessage(error)}
      </div>
    );
  }

  const users = data?.users || [];

  const handleRoleChange = async (user: any, newRole: string) => {
    if (user.role === newRole) return;
    setUpdatingId(user.id);
    setSuccessId(null);
    try {
      await updateUserRole({ id: user.id, role: newRole }).unwrap();
      setSuccessId(user.id);
      refetch();
      setTimeout(() => setSuccessId(null), 1500);
    } catch (e) {
      // Optionally handle error
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Role</th>
              <th className="px-4 py-2 border-b">Loyalty Points</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user: any) => (
                <tr key={user.id} className="text-center">
                  <td className="px-4 py-2 border-b">{user.fullName || "-"}</td>
                  <td className="px-4 py-2 border-b">{user.email}</td>
                  <td className="px-4 py-2 border-b">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={`px-2 py-1 rounded border ${user.role === "ADMIN" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"} flex items-center gap-2`}
                          disabled={updatingId === user.id}
                        >
                          {user.role}
                          <ChevronDown className="ml-1 w-4 h-4 text-gray-500" />
                          {updatingId === user.id && <span className="ml-2"><Loader size={16} /></span>}
                          {successId === user.id && <span className="ml-2 text-green-600">✓</span>}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {ROLES.map((role) => (
                          <DropdownMenuItem
                            key={role}
                            onSelect={() => handleRoleChange(user, role)}
                            disabled={user.role === role || updatingId === user.id}
                          >
                            {role}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                  <td className="px-4 py-2 border-b">{user.loyaltyPoints ?? "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 