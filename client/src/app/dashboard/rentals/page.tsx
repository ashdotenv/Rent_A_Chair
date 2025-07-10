"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DataTable } from "@/components/dashboard/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Eye, Edit, Trash2 } from "lucide-react";

export default function RentalsPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const rentalData = [
    {
      id: "RENT001",
      furniture: "Modern Sofa Set",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      status: "ACTIVE",
      amount: 299.99,
      paymentStatus: "SUCCESS",
    },
    {
      id: "RENT002",
      furniture: "Dining Table",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      status: "COMPLETED",
      amount: 199.99,
      paymentStatus: "SUCCESS",
    },
    {
      id: "RENT003",
      furniture: "Office Chair",
      startDate: "2024-02-01",
      endDate: "2024-03-01",
      status: "PENDING",
      amount: 89.99,
      paymentStatus: "PENDING",
    },
    {
      id: "RENT004",
      furniture: "Bed Frame",
      startDate: "2024-01-20",
      endDate: "2024-02-20",
      status: "ACTIVE",
      amount: 159.99,
      paymentStatus: "SUCCESS",
    },
  ];

  const columns = [
    {
      key: "id",
      label: "Rental ID",
    },
    {
      key: "furniture",
      label: "Furniture",
    },
    {
      key: "startDate",
      label: "Start Date",
    },
    {
      key: "endDate",
      label: "End Date",
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => {
        const variants = {
          ACTIVE: "default",
          COMPLETED: "secondary",
          PENDING: "outline",
          CANCELLED: "destructive",
        } as const;

        return (
          <Badge variant={variants[value as keyof typeof variants] || "outline"}>
            {value}
          </Badge>
        );
      },
    },
    {
      key: "amount",
      label: "Amount",
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: "paymentStatus",
      label: "Payment",
      render: (value: string) => {
        const variants = {
          SUCCESS: "default",
          PENDING: "outline",
          FAILED: "destructive",
        } as const;

        return (
          <Badge variant={variants[value as keyof typeof variants] || "outline"}>
            {value}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

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

        <DataTable
          title="Rental History"
          description="View and manage your rental history"
          columns={columns}
          data={rentalData}
          searchable
          filterable
        />
      </div>
    </DashboardLayout>
  );
} 