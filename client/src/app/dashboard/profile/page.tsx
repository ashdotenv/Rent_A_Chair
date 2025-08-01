"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUpdateProfileMutation } from "@/redux/features/user/userApi";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ fullName }).unwrap();
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  return (
      <div className="max-w-2xl mx-auto py-10">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
            <CardDescription>View and update your personal information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <Input
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="max-w-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input value={user.email} readOnly className="max-w-md bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <Input value={user.phone} readOnly className="max-w-md bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <Input value={user.address} readOnly className="max-w-md bg-gray-100" />
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary">{user.role}</Badge>
                <Badge variant="outline">{user.loyaltyPoints} pts</Badge>
              </div>
              <Button type="submit" className="bg-[#1980E5] hover:bg-[#1980E5]/90" disabled={isLoading}>
                {isLoading ? "Saving..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
  );
} 