"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useGetMyRentalsQuery } from "@/redux/features/user/userApi";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Calendar, CreditCard, Package, Eye } from "lucide-react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

export default function RentalsPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const { data: rentals, isLoading } = useGetMyRentalsQuery();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Rentals</h1>
            <p className="text-gray-600">
              Manage and track all your furniture rentals.
            </p>
          </div>
          <Button className="bg-[#1980E5] hover:bg-[#1980E5]/90">
            New Rental
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rental ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    </TableRow>
                  ))
                : rentals && rentals.length > 0 ? (
                    rentals.map((rental: any) => (
                      <TableRow key={rental.id}>
                        <TableCell className="font-mono text-xs text-gray-500">{rental.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={rental.furniture?.images?.[0]?.url || "/placeholder.jpg"}
                              alt={rental.furniture?.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <div className="font-semibold text-gray-900">{rental.furniture?.title}</div>
                              <div className="text-xs text-gray-500">{rental.furniture?.category?.replace("_", " ")}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(rental.startDate).toLocaleDateString()}<br />
                          <span className="text-xs text-gray-400">to</span><br />
                          {new Date(rental.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={rental.status === "ACTIVE" ? "default" : rental.status === "COMPLETED" ? "secondary" : rental.status === "CANCELLED" ? "destructive" : "outline"}>
                            {rental.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={rental.payment?.status === "SUCCESS" ? "default" : rental.payment?.status === "FAILED" ? "destructive" : "outline"}>
                            {rental.payment?.status || "PENDING"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-[#1980E5]">₹{rental.totalAmount}</TableCell>
                        <TableCell className="text-xs text-gray-500">
                          {rental.deliveryCity}, {rental.deliveryCountry}
                        </TableCell>
                        <TableCell>
                          <Link href={`/furniture/${rental.furniture?.id}`} className="inline-flex items-center gap-1 text-[#1980E5] hover:underline">
                            <Eye className="h-4 w-4" /> View
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-gray-500 py-16 text-lg">No rentals found.</TableCell>
                    </TableRow>
                  )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
} 