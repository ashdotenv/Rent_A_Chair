"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useGetUserDashboardQuery } from "@/redux/features/user/userApi";
import { useAppSelector } from "@/redux/hooks";
import {
  ShoppingCart,
  Heart,
  CreditCard,
  Truck,
  Gift,
  Star,
  TrendingUp,
  Package,
  Bell,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: dashboardData, isLoading: dashboardLoading } = useGetUserDashboardQuery();
  const wishlistCount = useAppSelector((state) => state.wishlist.ids.length);

  if (!user) {
    return null;
  }

  const stats = [
    {
      title: "Active Rentals",
      value: dashboardLoading || !dashboardData ? "-" : dashboardData.activeRentals.toString(),
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Wishlist Items",
      value: wishlistCount.toString(),  
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Loyalty Points",
      value: dashboardLoading || !dashboardData ? "-" : dashboardData.loyaltyPoints.toString(),
      icon: Gift,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Reviews",
      value: dashboardLoading || !dashboardData ? "-" : dashboardData.totalReviews?.toString(),
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];
  const recentRentals = Array.isArray(dashboardData?.latestRentals) ? dashboardData.latestRentals : [];
  // Debug: log rentals to verify data
  console.log(dashboardData);
  

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: "default",
      COMPLETED: "secondary",
      PENDING: "outline",
      CANCELLED: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your rentals.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
              3
            </Badge>
          </Button>
          <Button className="bg-[#1980E5] hover:bg-[#1980E5]/90">
            <Package className="mr-2 h-4 w-4" />
            Browse Furniture
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Rentals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Rentals</CardTitle>
          <CardDescription>
            Your latest rental activities and their current status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRentals.length === 0 && (
              <div className="text-gray-500">No recent rentals found.</div>
            )}
            {/* @ts-ignore */}
            {recentRentals.map((rental, idx) => (
              <div
                key={rental.id || idx}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <ShoppingCart className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{rental?.furniture?.title ?? "-"}</p>
                    <p className="text-sm text-gray-500">
                      {rental.startDate ? new Date(rental.startDate).toLocaleDateString() : "-"} - {rental.endDate ? new Date(rental.endDate).toLocaleDateString() : "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${rental.totalAmount ?? "-"}</p>
                    {getStatusBadge(rental.status ?? "PENDING")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="mr-2 h-5 w-5" />
              Track Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Check the status of your upcoming deliveries.
            </p>
            <Button variant="outline" className="w-full">
              View Deliveries
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              View your payment history and manage billing.
            </p>
            <Button variant="outline" className="w-full">
              View Payments
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Loyalty Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Redeem your loyalty points for discounts.
            </p>
            <Button variant="outline" className="w-full">
              Redeem Points
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 