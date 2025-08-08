"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "@/redux/features/auth/authSlice";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  FileText,
  Heart,
  CreditCard,
  Truck,
  AlertTriangle,
  Building2,
  Calendar,
  Star,
  Gift,
  RefreshCw,
  Bell,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  user: User;
  onClose?: () => void;
}

const userNavigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "My Rentals",
    href: "/dashboard/rentals",
    icon: ShoppingCart,
  },
  {
    title: "Wishlist",
    href: "/dashboard/wishlist",
    icon: Heart,
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    title: "Deliveries",
    href: "/dashboard/deliveries",
    icon: Truck,
  },
  {
    title: "Rent-to-Own",
    href: "/dashboard/rent-to-own",
    icon: Building2,
  },
  {
    title: "Furniture Swaps",
    href: "/dashboard/swaps",
    icon: RefreshCw,
  },
  {
    title: "Loyalty Points",
    href: "/dashboard/loyalty",
    icon: Gift,
  },
  {
    title: "Referral History",
    href: "/dashboard/referrals",
    icon: Users,
  },
  {
    title: "Reviews",
    href: "/dashboard/reviews",
    icon: Star,
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: Settings,
  },
];

const adminNavigationItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    title: "Furniture Management",
    href: "/admin/furniture",
    icon: Package,
  },
  {
    title: "Bundles",
    href: "/admin/bundles",
    icon: Package,
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Rental Management",
    href: "/admin/rentals",
    icon: ShoppingCart,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: FileText,
  },
  {
    title: "Damage Reports",
    href: "/admin/damage-reports",
    icon: AlertTriangle,
  },
  {
    title: "Maintenance",
    href: "/admin/maintenance",
    icon: Settings,
  },
  {
    title: "Subscriptions",
    href: "/admin/subscriptions",
    icon: Calendar,
  },
  {
    title: "Discounts",
    href: "/admin/discounts",
    icon: Gift,
  },
];

export function Sidebar({ user, onClose }: SidebarProps) {
  const pathname = usePathname();
  const isAdmin = user.role === "ADMIN";
  const navigationItems = isAdmin ? adminNavigationItems : userNavigationItems;

  const handleLogout = () => {
    // This will be handled by the navbar logout functionality
    if (onClose) onClose();
  };

  return (
    <>
      <div className="hidden lg:flex flex-col h-full w-64 bg-white border-r border-gray-200">
        {/* Logo/Brand */}
        {/* User Info */}
        <div className="flex flex-col gap-y-3 p-5 border-b border-gray-200">
          <div className="flex items-center gap-x-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-[#1980E5] text-white">
                {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Badge variant={isAdmin ? "destructive" : "secondary"} className="text-xs px-2 py-1">
              {isAdmin ? "Admin" : "User"}
            </Badge>
            {!isAdmin && (
              <Badge variant="outline" className="text-xs px-2 py-1">
                {user.loyaltyPoints} pts
              </Badge>
            )}
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-y-1 p-3 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#1980E5] text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>
        {/* Logout */}
        <div className="p-3 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 text-sm px-3 py-2"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </>

  );
} 