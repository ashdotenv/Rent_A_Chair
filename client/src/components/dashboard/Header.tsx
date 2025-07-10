"use client";

import React from "react";
import { User } from "@/redux/features/auth/authSlice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

interface HeaderProps {
  user: User;
}

export function Header({ user }: HeaderProps) {
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center justify-between">
          {/* Left side - Welcome message */}
          {/* <div className="flex items-center gap-x-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Welcome back, {user.fullName.split(' ')[0]}!
            </h2>
            {!isAdmin && (
              <Badge variant="outline" className="text-xs">
                {user.loyaltyPoints} Loyalty Points
              </Badge>
            )}
          </div> */}

          {/* Right side - Notifications only */}

        </div>
      </div>
    </div>
  );
} 