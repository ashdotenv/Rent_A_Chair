"use client"
import React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/features/auth/authSlice";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = useAppSelector(selectUser);

  if (!user) {
    // Optionally, redirect to login or show a loading state
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
} 